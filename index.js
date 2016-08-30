'use strict';

var colors = require('colors'); 
var fs=require('fs');
var path=require('path');
var childProcess=require('child_process');

var cliType=(process.platform=='win32'?'cmd':'bash');
var terminal;
	

function Pfrme(){
	this.version=JSON.parse(fs.readFileSync(path.join(process.env.APPDATA,'/npm/node_modules/pframe','/package.json'),'utf8')).version;
}
Pfrme.prototype.printVersion=function(){
	console.log(this.version);
	process.exit();
};
Pfrme.prototype.downloadPlay=function(version){
	console.log('download playframework');
	process.exit();
};
Pfrme.prototype.listPlayVersion=function(){
	terminal=childProcess.spawn(cliType);
	terminal.stdout.on('data',function(data){
		var stringData=String.fromCharCode.apply(null,data);
		var res=stringData.match(/play!\s+([0-9\.]+),/);
		// console.log(res)
		if(res && res.length>1){
			console.log(res[1]);
		}
	});
	terminal.stdin.write('play version\n');
	terminal.stdin.end();
};
Pfrme.prototype.generateSeed=function(needSPA,folder){
	terminal=childProcess.spawn(cliType);
	terminal.stdout.on('data',function(data){
		var stringData=String.fromCharCode.apply(null,data);
		var res=stringData.match(/Oops.\s+([\S\\\\]+)\s+already\s+exists/);
		// 已存在同名文件夹
		if(res && res.length>1){
			console.log(res[1].red+' already exists.');
			process.exit();
		}else if(stringData.indexOf('OK, the application is created.')!=-1){
			//生成前端种子文件夹
			var assetsDir=path.join(process.env.APPDATA,'/npm/node_modules/pframe','/assets');
			copy(assetsDir,path.join(process.cwd(),'/',folder));
			console.log('project seed '+path.join(process.cwd(),'/',folder).green+' has already been created.');
		}
	});
	terminal.stdin.write('play new '+folder+'\n');
	terminal.stdin.write(folder+'\n');
	terminal.stdin.end();
};
function copy(srcPath,destPath){
	var contents=fs.readdirSync(srcPath),
			  	 readStream,
			  	 writeStream,
			  	 srcFolder,
			  	 destFolder;
	contents.forEach(function(o,i){
		srcFolder=path.join(srcPath,'/',o);
		destFolder=path.join(destPath,'/',o);
		var stat=fs.statSync(srcFolder);
		if(stat.isFile()){
			readStream=fs.createReadStream(srcFolder);
			writeStream=fs.createWriteStream(destFolder);
			readStream.pipe(writeStream);
		}else if(stat.isDirectory()){
			var destStat;
			try{
				destStat=fs.statSync(destFolder);
				if(!destStat || !destStat.isDirectory()){
					fs.mkdirSync(destFolder);
				}
			}catch(e){
				fs.mkdirSync(destFolder);
			}
			copy(srcFolder,destFolder);
		}
	});

}
module.exports=new Pfrme();