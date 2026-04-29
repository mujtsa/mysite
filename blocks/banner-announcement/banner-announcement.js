export default function decorate(block) {
  const wrapper = block.querySelector(':scope > div');
  if (wrapper) {
    wrapper.classList.add('banner-announcement-content');
  }
}
