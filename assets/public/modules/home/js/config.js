angular
	.module('gcjszx',['ui.router','gcjszx.search'])
	.run(function(generalInfo,$rootScope,menus){
		$rootScope.generalInfo=generalInfo;
		menus.addMenuItem({
			title:'Home',
			state:'home'
		});
	})
	.config(function($urlRouterProvider,$stateProvider,generalInfo,$locationProvider){
			// if(window.navigator.userAgent.indexOf("IE 8.0")==-1 && window.navigator.userAgent.indexOf("IE 9.0")==-1){
			// 	$locationProvider.html5Mode(true);
			// }
		$urlRouterProvider
	        .otherwise('/');
	    $stateProvider
	        .state('home',{
	            url:'/',
	            controller:'homeCtrl',
	            templateUrl:generalInfo.basePath+'/html/home.html'
	        });
	})
	.service('menus',function($rootScope){
		var menus=[];
		$rootScope.menus=menus;
		return {
			addMenuItem:function(obj){
				menus.push(obj);
			}
		};
	})
	.constant('generalInfo',{
			basePath:'/public/modules/home',
			copyright:'.....'+new Date().getFullYear()+'....',
			contactInfo:'.........'
	});