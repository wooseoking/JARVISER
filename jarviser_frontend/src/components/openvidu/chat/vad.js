const VAD = (options) => {
  // Default options
  const defaultOptions = {
    fftSize: 512,
    bufferLen: 512,
    voice_stop: function () {},
    voice_start: function () {},
    smoothingTimeConstant: 0.99,
    energy_offset: 1e-8,
    energy_threshold_ratio_pos: 2,
    energy_threshold_ratio_neg: 0.5,
    energy_integration: 1,
    filter: [
      {f: 200, v: 0},
      {f: 2000, v: 1},
    ],
    source: null,
    context: null,
  };

  // Merge user options with default options
  const mergedOptions = {...defaultOptions, ...options};

  if (!mergedOptions.source)
    throw new Error("The options must specify a MediaStreamAudioSourceNode.");

  mergedOptions.context = mergedOptions.source.context;

  // Rest of VAD properties and methods
  const hertzPerBin = mergedOptions.context.sampleRate / mergedOptions.fftSize;
  const iterationFrequency =
    mergedOptions.context.sampleRate / mergedOptions.bufferLen;
  const iterationPeriod = 1 / iterationFrequency;

  let filter = [];
  const setFilter = (shape) => {
    filter = new Array(mergedOptions.fftSize / 2).fill(0);
    for (let i = 0; i < mergedOptions.fftSize / 2; i++) {
      for (let j = 0; j < shape.length; j++) {
        if (i * hertzPerBin < shape[j].f) {
          filter[i] = shape[j].v;
          break; // Exit j loop
        }
      }
    }
  };

  setFilter(mergedOptions.filter);

  const analyser = mergedOptions.context.createAnalyser();
  analyser.smoothingTimeConstant = mergedOptions.smoothingTimeConstant;
  analyser.fftSize = mergedOptions.fftSize;

  const floatFrequencyData = new Float32Array(analyser.frequencyBinCount);
  const floatFrequencyDataLinear = new Float32Array(floatFrequencyData.length);

  mergedOptions.source.connect(analyser);

  const scriptProcessorNode = mergedOptions.context.createScriptProcessor(
    mergedOptions.bufferLen,
    1,
    1
  );
  scriptProcessorNode.connect(mergedOptions.context.destination);

  let energy_offset = mergedOptions.energy_offset;
  let energy_threshold_pos =
    energy_offset * mergedOptions.energy_threshold_ratio_pos;
  let energy_threshold_neg =
    energy_offset * mergedOptions.energy_threshold_ratio_neg;

  let voiceTrend = 0;
  const voiceTrendMax = 10;
  const voiceTrendMin = -10;
  const voiceTrendStart = 5;
  const voiceTrendEnd = -5;

  let vadState = false; // True when Voice Activity Detected

  scriptProcessorNode.onaudioprocess = function (event) {
    analyser.getFloatFrequencyData(floatFrequencyData);
    update();
    monitor();
  };

  mergedOptions.source.connect(scriptProcessorNode);

  const update = () => {
    for (let i = 0; i < floatFrequencyData.length; i++) {
      floatFrequencyDataLinear[i] = Math.pow(10, floatFrequencyData[i] / 10);
    }
  };

  const getEnergy = () => {
    let energy = 0;
    for (let i = 0; i < floatFrequencyDataLinear.length; i++) {
      energy +=
        filter[i] * floatFrequencyDataLinear[i] * floatFrequencyDataLinear[i];
    }
    return energy;
  };

  const monitor = () => {
    const energy = getEnergy();
    const signal = energy - energy_offset;

    if (signal > energy_threshold_pos) {
      voiceTrend = Math.min(voiceTrendMax, voiceTrend + 1);
    } else if (signal < -energy_threshold_neg) {
      voiceTrend = Math.max(voiceTrendMin, voiceTrend - 1);
    } else {
      if (voiceTrend > 0) voiceTrend--;
      else if (voiceTrend < 0) voiceTrend++;
    }

    const start = voiceTrend > voiceTrendStart;
    // const start = true;
    const end = voiceTrend < voiceTrendEnd;

    const integration =
      signal * iterationPeriod * mergedOptions.energy_integration;

    if (integration > 0 || !end) {
      energy_offset += integration;
    } else {
      energy_offset += integration * 10;
    }
    energy_offset = Math.max(0, energy_offset);
    energy_threshold_pos =
      energy_offset * mergedOptions.energy_threshold_ratio_pos;
    energy_threshold_neg =
      energy_offset * mergedOptions.energy_threshold_ratio_neg;

    if (start && !vadState) {
      vadState = true;
      mergedOptions.voice_start();
    }
    if (end && vadState) {
      vadState = false;
      mergedOptions.voice_stop();
    }
  };

  return {
    // Add any functions or properties you wish to expose here
    setFilter,
    getEnergy,
    monitor,
  };
};

export default VAD;
