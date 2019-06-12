const headerNamespace = {
  initializeStandaloneSearchbox: () => {
    Coveo.SearchEndpoint.configureCloudV2Endpoint('coveosearch', 'xxf4d1df7a-7916-481e-9917-f562dddc322d');
    const root = Coveo.$$(document).find('#coveoConnectHeaderStandaloneSearchbox');
    Coveo.initSearchbox(root, 'https://connect.coveo.com/s/global-search/%40uri');
  },

  initializeDropdownMenus: () => {
    function unselectOnClickOutside(element) {
      function outsideClickListener(event) {
        if (!element.contains(event.target)) {
          element.classList.remove('selected');
          removeClickListener();
        }
      }
      function removeClickListener() {
        document.removeEventListener('click', outsideClickListener);
      }
      document.addEventListener('click', outsideClickListener);
    }

    let buttons = document.querySelectorAll('header .content .navBar button.dropdownButton');

    for (let i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', () => {
        unselectOnClickOutside(buttons[i]);
        buttons[i].classList.toggle('selected');
      });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  headerNamespace.initializeStandaloneSearchbox();
  headerNamespace.initializeDropdownMenus();
});
