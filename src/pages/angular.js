// Add Angular integrations if Angular is available
if ((typeof angular === 'object') && angular.module) {

  angular.module('ionic.service.pages', [])

  .provider('$ionicPages', ['$stateProvider', function($stateProvider) {
    console.log('GETTING', $stateProvider);
    var pages = new Ionic.Pages();
    pages.initialize();

    pages._$stateProvider = $stateProvider;

    this.$get = [function() {
      return pages;
    }];
  }])

  .run(['$ionicPages', '$compile', '$rootScope', function($ionicPages, $compile, $rootScope) {
    var loadPromise = $ionicPages.fetchPages();

    loadPromise.then(function(pages) {
      console.log('LOADED PAGES', pages);

      let p;
      for (let i = 0; i < pages.length; i++) {
        p = pages[i];
        console.log(p);

        var wrapperHtml = `<script id="about-page.html" type="text/ng-template">
        <style>${p.css}</style>

        ${p.html}

        </script>`;

        var html = $compile(wrapperHtml)($rootScope);

        angular.element(document.body).append(html);

        let c = p.stateConfig;

        console.log('Registering new state', c.state, c.url, c.templateUrl);

        $ionicPages._$stateProvider.state(c.state, {
          url: c.url,
          templateUrl: c.templateUrl
        })
      }

    }).catch(function(err) {
      console.error('Unable to load dynamic Ionic Pages', err);
    });

  }])
}
