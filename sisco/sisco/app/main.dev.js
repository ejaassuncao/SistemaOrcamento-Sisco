'use strict';
/**
* Este script é utilizado a producao
*/
require.config({
    baseUrl: 'js',
	paths: {
		//libs
        'jquery':'jquery.min',
        'jquery-ui':'jquery-ui.min',
        'bootstrap':'bootstrap.min',
        'angular':'angular.min',
        'angular-locale':'angular-locale_pt-br',
        'angular-route':'angular-route.min',
        'angular-resource':'angular-resource.min',
        'angular-animate':'angular-animate.min',
        'angular-sanitize':'angular-sanitize.min',
        //resources
        'jquery.inputmask':'jquery.inputmask.min',
        'jquery.fancybox':'fancybox/jquery.fancybox.pack',
        'jquery.inputmask.regex':'jquery.inputmask.regex.extensions.min',
        'toaster':'toaster.min',
        'bootstrap-ui':'ui-bootstrap-tpls.min',
        'data-tables-jquery':'jquery.data-tables.min',
        'data-tables-bootstrap':'data-tables.bootstrap.min',
        'chosen':'chosen.min',
        'masks': 'masks.min',
        'select2':'select2.min',
        'bootstrap-datepicker':'bootstrap-datepicker.min',
        'angular-bootstrap-lightbox':'angular-bootstrap-lightbox.min',
        'jquery.jcarousel':'jquery.jcarousel.min',
        'jcarousel.responsive':'jcarousel.responsive.min',
        'file-upload':'angular-file-upload.min',
        //app
        'extension':'../app-config/extension',
        'customFilters':'../app-config/customFilters',
        'rotas':'../app-config/rotas',        
        'httpInterceptor':'../app-config/httpInterceptor',
        'api':'../app-config/api',
        'app':'../app-config/app',
        'service-model':'../app-config/service-model',
        'menu':'../app-config/menu',
        'usuarioCtrl':'../app-controller/usuario'
	},
	shim: {
       //libs
		'jquery-ui': { deps: ['jquery'] },
        'bootstrap': { deps: ['jquery'] },
        'angular-locale':{deps:['angular']},
        'angular-route':{deps:['angular']},
        'angular-resource':{deps:['angular']},
        'angular-animate':{deps:['angular']},
        'angular-sanitize':{deps:['angular']},
         //resources
        'jquery.inputmask': { deps: ['jquery'] },
        'jquery.fancybox': { deps: ['jquery'] },
        'jquery.inputmask.regex': { deps: ['jquery','jquery.inputmask'] },
        'toaster':{deps:['angular','angular-animate','angular-sanitize']},
        'bootstrap-ui': { deps: ['jquery','bootstrap'] },
        'data-tables-jquery': { deps: ['jquery'] },
        'data-tables-bootstrap': { deps: ['bootstrap','data-tables-jquery'] },
        'chosen': { deps: ['jquery'] },       
        'masks':{ deps: ['jquery'] },
        'select2':{ deps: ['jquery'] },
        'bootstrap-datepicker':{ deps: ['jquery','bootstrap'] },
        'angular-bootstrap-lightbox.min':{deps:['angular']},
        'jquery.jcarousel':{ deps: ['jquery'] },
        'jcarousel.responsive':{ deps: ['jquery.jcarousel'] },
        'file-upload':{deps:['angular']},
        //app
        'customFilters':{deps:['angular']},         
        'rotas':{deps:['angular']},    
        'httpInterceptor':{deps:['angular']},  
        'api':{deps:['angular','jquery','bootstrap-ui', 'file-upload']},   
        'app':{deps:['angular','api']},  
        'service-model':{deps:['angular','app']},  
        'menu':{deps:['angular','app']},
        'usuarioCtrl':{deps:['angular','app']}
	},
	urlArgs: (new Date()).getTime()
});

require([	
		//libs		
	   'jquery',
       'jquery-ui',
       'bootstrap',
       'angular',
       'angular-locale',
       'angular-route',
       'angular-resource',
       'angular-animate',
       'angular-sanitize',
        //resources
       'jquery.inputmask',
       'jquery.fancybox',
       'jquery.inputmask.regex',
       'toaster',
       'bootstrap-ui',
       'data-tables-jquery',
       'data-tables-bootstrap',
       'chosen',
       'masks',
       'select2',
       'bootstrap-datepicker',
       'angular-bootstrap-lightbox.min',
       'jquery.jcarousel',
       'jcarousel.responsive',
       'file-upload',
      // app
       'extension',
       'customFilters',       
       'rotas',        
       'httpInterceptor',
       'api', 
       'app',
       'service-model',
       'menu',
       'usuarioCtrl'
       
        
], function () {
	angular.bootstrap(document, ['app']);	
});

