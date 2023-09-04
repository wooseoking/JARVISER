const createAudioContext = () => {
  const AudioContextConstructor =
    window.AudioContext || window.webkitAudioContext;
  return new AudioContextConstructor();
};

export {createAudioContext};
