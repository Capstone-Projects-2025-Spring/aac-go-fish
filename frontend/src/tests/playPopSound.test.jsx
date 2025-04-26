import { playPopSound } from '../components/SoundEffects/playPopSound';

describe('playPopSound', () => {
  const originalAudio = global.Audio;

  beforeEach(() => {
    global.Audio = jest.fn().mockImplementation((src) => ({
      src,
      volume: 1,
      play: jest.fn(),
    }));
  });

  afterEach(() => {
    global.Audio = originalAudio;
    jest.resetAllMocks();
  });

  it('should instantiate Audio with the correct source', () => {
    playPopSound();
    expect(global.Audio).toHaveBeenCalledWith('/audio/pop.mp3');
  });

  it('should set the audio volume to 0.2', () => {
    playPopSound();
    const audioInstance = global.Audio.mock.results[0].value;
    expect(audioInstance.volume).toBe(0.2);
  });

  it('should call play on the audio instance', () => {
    playPopSound();
    const audioInstance = global.Audio.mock.results[0].value;
    expect(audioInstance.play).toHaveBeenCalled();
  });
});
