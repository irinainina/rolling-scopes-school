import render from './index';

describe('render is a function for render HTML', () => {
  it('Should be an instance of a function', () => {
    expect(render).toBeInstanceOf(Function);
  });

  it('Should be render correctly', () => {
    const context = {
      titles: [
        'Video about JS',
      ],
    };
    render.call(context);
    expect(document.body.innerHTML).toMatchSnapshot();
  });
});
