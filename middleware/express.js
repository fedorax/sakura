// 'use strict' モードを有効化
'use strict';

// モジュール依存関係の読み込み
const express = require('express'),
	morgan = require('morgan'),
	compress = require('compression'),
	methodOverride = require('method-override');

// Expressの設定メソッドを定義
module.exports = function() {
	// 新しいExpressアプリケーションインスタンスを作成
	const app = express();

	// 'NODE_ENV'変数を使用して 'morgan' ロガーや 'compress' ミドルウェアをアクティベート
	if (process.env.NODE_ENV === 'development') {
		app.use(morgan('dev'));
	} else if (process.env.NODE_ENV === 'production') {
		app.use(compress());
	}

	// Expressに組み込まれているbody parsingミドルウェアを使用
	app.use(express.urlencoded({
		extended: true
	}));
	app.use(express.json());

	// 'method-override' ミドルウェアの使用
	app.use(methodOverride('_method'))

	// アプリケーションのビューエンジンと 'views' フォルダの設定
	app.set('views', './app/views');
	app.set('view engine', 'ejs');

	// 静的ファイルの提供を設定
	app.use(express.static('./public'));

	// Expressアプリケーションインスタンスを返す
	return app;
};
