var fs=require('fs');
var path=require('path');
var childProcess=require('child_process');

var cliType=(process.platform=='win32'?'cmd':'bash');
var terminal=childProcess.spawn(cliType);
	

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
	terminal.stdout.on('data',function(data){
		var stringData=String.fromCharCode.apply(null,data);
		var res=stringData.match(/play!\s+(\d+\.\d+\.\d+),/i);
		// console.log(res)
		if(res && res.length>1){
			console.log(res[1]);
		}
	});
	terminal.stdin.write('play version\n');
	terminal.stdin.end();
};
Pfrme.prototype.generateSeed=function(needSPA,folder){
	console.log(path.join(process.cwd(),'/',folder));
	process.exit();
};

module.exports=new Pfrme();