(function () {
  "use strict";

  var MODEL_ID = "doubao-seed-2-0-lite-260428";
  var REASONING_EFFORT = "high";
  var SERVICE_TIER = "auto";
  var callButton = document.getElementById("call-button");
  var runtimeValue = document.getElementById("runtime-value");
  var runtimeDot = document.getElementById("runtime-dot");
  var resultState = document.getElementById("result-state");
  var answer = document.getElementById("answer");
  var rawResult = document.getElementById("raw-result");
  var elapsed = document.getElementById("elapsed");
  var requestStartedAt = 0;
  var finalOutcome = "";
  var callbacks = {};

  function platformApi() {
    return window.tt && typeof window.tt.callAIChatCompletion === "function"
      ? window.tt.callAIChatCompletion.bind(window.tt)
      : null;
  }

  function safeValue(value) {
    if (value === undefined) return "[undefined]";
    if (value === null) return null;
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      return value;
    }
    if (Array.isArray(value)) return value.map(safeValue);
    if (typeof value === "object") {
      var result = {};
      Object.keys(value).forEach(function (key) {
        result[key] = safeValue(value[key]);
      });
      return result;
    }
    return String(value);
  }

  function renderRaw() {
    rawResult.textContent = JSON.stringify(callbacks, null, 2);
  }

  function recordCallback(name, payload) {
    callbacks[name] = safeValue(payload);
    renderRaw();
  }

  function setOutcome(kind, title, message) {
    finalOutcome = kind;
    resultState.className = "result-state " + kind;
    resultState.textContent = title;
    answer.textContent = message || "";
    elapsed.textContent = requestStartedAt
      ? Math.round(performance.now() - requestStartedAt) + " ms"
      : "";
  }

  function inspectRuntime() {
    if (platformApi()) {
      runtimeValue.textContent = "tt.callAIChatCompletion 已注入";
      runtimeDot.className = "status-dot ready";
      callButton.disabled = false;
      return;
    }

    runtimeValue.textContent = "当前不是互动空间运行容器";
    runtimeDot.className = "status-dot missing";
    callButton.disabled = true;
    setOutcome("error", "无法调用", "请上传后使用抖音扫码测试。");
    callbacks.runtime = {
      hasTT: Boolean(window.tt),
      hasCallAIChatCompletion: false,
      userAgent: navigator.userAgent,
    };
    renderRaw();
  }

  callButton.addEventListener("click", function () {
    var callAIChatCompletion = platformApi();
    if (!callAIChatCompletion) {
      inspectRuntime();
      return;
    }

    callButton.disabled = true;
    callButton.textContent = "正在调用…";
    resultState.className = "result-state";
    resultState.textContent = "等待平台返回";
    answer.textContent = "";
    elapsed.textContent = "";
    callbacks = {};
    finalOutcome = "";
    requestStartedAt = performance.now();
    renderRaw();

    try {
      callAIChatCompletion({
        type: "text",
        model: MODEL_ID,
        reasoning_effort: REASONING_EFFORT,
        service_tier: SERVICE_TIER,
        stream: false,
        messages: [
          {
            role: "user",
            content: "只回复：互动空间 AI 调用成功",
          },
        ],
        success: function (res) {
          recordCallback("success", res);
          var text = res && typeof res.data === "string" ? res.data.trim() : "";
          if (text) {
            setOutcome("success", "调用成功", text);
          } else {
            setOutcome("error", "成功回调没有正文", "请查看下方原始回调。");
          }
        },
        fail: function (err) {
          recordCallback("fail", err);
          var type = err && err.errorType ? String(err.errorType) : "未知";
          var code = err && err.errorCode !== undefined
            ? String(err.errorCode)
            : "未知";
          var message = err && err.errMsg ? String(err.errMsg) : "无错误信息";
          setOutcome(
            "error",
            "调用失败 · " + type + "/" + code,
            message,
          );
        },
        complete: function (res) {
          recordCallback("complete", res);
          if (!finalOutcome) {
            setOutcome("error", "调用结束但没有成功结果", "请查看下方原始回调。");
          }
          callButton.disabled = false;
          callButton.textContent = "再调用一次";
        },
      });
    } catch (error) {
      recordCallback("throw", {
        name: error && error.name,
        message: error && error.message ? error.message : String(error),
      });
      setOutcome("error", "接口启动失败", error && error.message ? error.message : String(error));
      callButton.disabled = false;
      callButton.textContent = "再调用一次";
    }
  });

  inspectRuntime();
})();
