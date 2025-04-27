import { playSendSound } from '../../../components/SoundEffects/playSendSound';

describe('playSendSound', () => {
  const originalAudio = global.Audio;

  beforeEach(() => {
    global.Audio = jest.fn().mockImplementation((src) => ({
      src,
      play: jest.fn(),
    }));
  });

  afterEach(() => {
    global.Audio = originalAudio;
    jest.resetAllMocks();
  });

  it('should instantiate Audio with the correct source', () => {
    playSendSound();
    expect(global.Audio).toHaveBeenCalledWith('/audio/OrderUp.mp3');
  });

  it('should call play on the audio instance', () => {
    playSendSound();
    const audioInstance = global.Audio.mock.results[0].value;
    expect(audioInstance.play).toHaveBeenCalled();
  });
});
