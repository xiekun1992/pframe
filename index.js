'use strict';

var colors = require('colors'); 
var https=require('https');
var fs=require('fs');
var path=require('path');
var childProcess=require('child_process');

var cliType=(process.platform=='win32'?'cmd':'bash');
var terminal,pframePath;
var playOnlineSourceUrl="https://xiekun1992.github.io/asset/playframework/";

function Pfrme(){
	var availablePath;
	try{
		pframePath=path.join(process.env.APPDATA,'/npm/node_modules/pframe');
		availablePath=path.join(process.env.APPDATA,'/npm/node_modules/pframe','/package.json');
		fs.statSync(availablePath);
	}catch(e){
		pframePath=path.join(process.execPath,'../node_modules/pframe');
		availablePath=path.join(process.execPath,'../node_modules/pframe','/package.json');
		fs.statSync(availablePath);
	}
	this.version=JSON.parse(fs.readFileSync(availablePath,'utf8')).version;
}
Pfrme.prototype.printVersion=function(){
	terminal=childProcess.spawn(cliType);
	terminal.stdout.on('data',function(data){
		var stringData=String.fromCharCode.apply(null,data);
		var res=stringData.match(/play!\s+([0-9\.]+),/);
		// console.log(res)
		if(res && res.length>1){
			console.log('play: '+res[1]);
		}else{
			console.log('play: '+'unknown'.red);
			console.log('please add playframework path to the environment variable first.'.red);
		}
	});
	console.log('pframe: '+this.version);
	terminal.stdin.write('play version\n');
	terminal.stdin.end();
};
Pfrme.prototype.downloadPlay=function(version){
	var playSize=0,totalSize=0,progressNum=0,chunks=[],size;
	console.log('download play-'+version+'.zip');
	https.get(playOnlineSourceUrl+'play-'+version+'.zip', function(res){
//	console.log('statusCode:', res.statusCode);
		totalSize=res.headers['content-length'];
		
		if(res.statusCode!=200){
			console.log('fail to download specified play version.'.red);
		}else{
			size=parseInt(res.headers['content-length']);
			process.stdout.write('total size: '+size+' Bytes\ndownloading [');
			res.on('data', function(d){
				chunks.push(d);
				playSize+=d;
				var percent=((playSize.length/totalSize)*100).toFixed(2);
				//console.log(percent);
				if(percent%2>0 && Math.round(percent/2)!=progressNum){
					for(var i=0;i<Math.round(percent/2)-progressNum;i++){
						process.stdout.write('='.green);	
					}
					progressNum=Math.round(percent/2);
					
				}

			});
			res.on('end',function(){
				console.log('] finished\n');
				console.log('file has been downloaded in the current folder\nplease add playframework path to the environment variable'.green);
				  var data = new Buffer(size);  
			      for (var i = 0, pos = 0, l = chunks.length; i < l; i++) {  
			        var chunk = chunks[i];  
			        chunk.copy(data, pos);  
			        pos += chunk.length;  
			      }  
				fs.writeFileSync('play-'+version+'.zip', data);
			});
		}
	}).on('error', function(e){
	  console.error(e);
	});
	//process.exit();
};
Pfrme.prototype.listPlayVersion=function(){
	httpRequest();
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
			var assetsDir=path.join(pframePath,'/assets');
			copy(assetsDir,path.join(process.cwd(),'/',folder));
			console.log('project seed '+path.join(process.cwd(),'/',folder).green+' has already been created.');
		}
	});
	terminal.stdin.write('play new '+folder+'\n');
	terminal.stdin.write(folder+'\n');
	terminal.stdin.end();
	setTimeout(function(){
		try{
			fs.statSync(path.join(process.cwd(),'/',folder));
		}catch(e){
			console.log('please add playframework path to the environment variable first.'.red);
		}
	},1000);
};
function httpRequest(){
	https.get(playOnlineSourceUrl+'version.txt', function(res){
		// console.log('statusCode:', res.statusCode);
		if(res.statusCode!=200){
			console.log('fail to gain play version list.'.red);
		}
		res.on('data', function(d){
		    process.stdout.write('available version in pframe:\n'+d);
		});

		res.on('error', function(e){
		  console.error(e);
		});
	});
}
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