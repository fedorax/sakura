const {globSync} = require('glob');

module.exports = function (app) {
	const routerList = globSync('./app/router/*.routes.js');
	console.log(routerList);
	routerList.forEach(function(route){
		require('../'+ route)(app);
	});
	// 'index' ルーティングファイルの読み込み
	//require('../app/router/index.routes.js')(app);
    //require('../app/router/sql.routes.js')(app);

};