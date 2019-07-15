import 'jest-dom/extend-expect'
var tools = require('./toolsModule');

test('boxSize returns right values', () => {
  const elements = [{
        checked: true,
        value: 2
    }];

    expect(tools.boxSize(elements)).toBe(2);
});

test('resizeCanvas returns right values', () => {
  const elements = [{
        checked: true,
        value: 128
    }];

    expect(tools.resizeCanvas(elements)).toBe(128);
});

test('scale returns right values', () => {

  const canvas = {
        offsetWidth: '640',
        width: '32'
    };

  expect(tools.scale(canvas)).toBe(20);
});






