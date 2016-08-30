angular
	.module('gcjszx.search',['ui.router'])
	.run(function(generalInfo,$rootScope,menus){
		$rootScope.generalInfo=generalInfo;
		menus.addMenuItem({
			title:'Search',
			state:'search'
		});
	})
	.config(function($urlRouterProvider,$stateProvider,generalInfo,$locationProvider){
			// if(window.navigator.userAgent.indexOf("IE 8.0")==-1 && window.navigator.userAgent.indexOf("IE 9.0")==-1){
			// 	$locationProvider.html5Mode(true);
			// }
			// $urlRouterProvider
	  //       .otherwise('/');
	    $stateProvider
	        .state('search',{
	            url:'/search',
	            controller:'searchCtrl',
	            templateUrl:generalInfo.basePath+'/html/search.html'
	        });
	})
	.constant('generalInfo',{
			basePath:'/public/modules/search'
	});