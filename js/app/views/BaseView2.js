define(['models/TreeNodeModel', 'collections/TreeCollection', 'models/TreeNodeModel1'],function(TreeModel, TreeCollection, TreeModel1){
    BaseView = Backbone.View.extend({
		objects : [],
        
		mouseX : 0,
		mouseY : 0,
        reverse : 1,
		stepY : 300,
		lineTurne : 375,
        renderer : null,
		
		isMouseDown : false,
		onMouseDownPosition: null,
		mouse : new THREE.Vector2(),
		nodeWidth : 360,
		nodeHeight : 450,			
		imgPlusSize : 70,
        SELECTED: null,
        data1:{},
		data2:{},
		TempObj : {},
        
        lineGeo : new THREE.Geometry(),
        lineMat : new THREE.LineBasicMaterial({color: 0x888888, lineWidth: 1}),
        line : new THREE.Line(this.lineGeo, this.lineMat),
        coordScene : new THREE.Scene(),
        
        light : new THREE.PointLight(0xFFCC99),
        ambient : new THREE.PointLight(0x333366),
		
		events: {
			"mousedown canvas" : "onmousedown",
			"mouseup canvas": "onmouseup",
			"mousemove canvas" : "onmousemove", 
			"mousewheel canvas" : "onmousewheel"
		},
		
		initialize: function(){
            
            this.renderer = new THREE.WebGLRenderer({antialias: true});
            this.renderer.setSize(document.body.clientWidth, document.body.clientHeight);
            document.body.appendChild(this.renderer.domElement);
            this.renderer.setClearColorHex(0xEEEEEE, 1.0);
            this.renderer.clear();
            
            var width = this.renderer.domElement.width;
            var height = this.renderer.domElement.height;
            this.camera = new THREE.PerspectiveCamera( 70, width/height, 1, 10000 );
            this.camera.position.y = 30;
            this.scene = new THREE.Scene();
            this.coordScene = new THREE.Scene();
            this.coordScene.fog = new THREE.FogExp2(0xEEEEEE, 0.0035);
            
            this.light.position.set(150, 200, 300);
            this.scene.add(this.light);
            
            this.ambient.position.set(-150, -200, -300);
            this.scene.add(this.ambient);
            
            var json='[{"id":"50","l_name":"Derevenets","f_name":"Bogdan","f_id":"115","m_id":"116","ch_ids":["120","123","124","125"],"spouse_id":"121","b_date":"1989","d_date":"0","sex":"m","photo_url":"","comment":""},{"id":"115","l_name":"","f_name":"Father","f_id":"0","m_id":"0","ch_ids":["50","117"],"spouse_id":"116","b_date":"0","d_date":"0","sex":"m","photo_url":"no_avatar.jpg","comment":""},{"id":"116","l_name":"?","f_name":"Mother","f_id":"0","m_id":"0","ch_ids":["50","117"],"spouse_id":"115","b_date":"0","d_date":"0","sex":"f","photo_url":"no_avatar.jpg","comment":""},{"id":"117","l_name":"","f_name":"Brother","f_id":"115","m_id":"116","ch_ids":[],"spouse_id":"0","b_date":"0","d_date":"0","sex":"m","photo_url":"no_avatar.jpg","comment":""},{"id":"120","l_name":"","f_name":"kim","f_id":"50","m_id":"121","ch_ids":["127"],"spouse_id":"126","b_date":"0","d_date":"0","sex":"f","photo_url":"no_avatar.jpg","comment":""},{"id":"121","l_name":"?","f_name":"?","f_id":"0","m_id":"0","ch_ids":["120","123","124","125"],"spouse_id":"50","b_date":"0","d_date":"0","sex":"f","photo_url":"no_avatar.jpg","comment":""},{"id":"123","l_name":"12","f_name":"12","f_id":"50","m_id":"121","ch_ids":[],"spouse_id":"0","b_date":"12","d_date":"0","sex":"m","photo_url":"no_avatar.jpg","comment":""},{"id":"124","l_name":"123","f_name":"123","f_id":"50","m_id":"121","ch_ids":[],"spouse_id":"0","b_date":"12","d_date":"0","sex":"m","photo_url":"no_avatar.jpg","comment":""},{"id":"125","l_name":"222","f_name":"112","f_id":"50","m_id":"121","ch_ids":[],"spouse_id":"0","b_date":"2222","d_date":"0","sex":"f","photo_url":"no_avatar.jpg","comment":""},{"id":"126","l_name":"21312","f_name":"2321","f_id":"0","m_id":"0","ch_ids":["127"],"spouse_id":"120","b_date":"1221","d_date":"0","sex":"m","photo_url":"no_avatar.jpg","comment":""},{"id":"127","l_name":"ewrw","f_name":"324","f_id":"126","m_id":"120","ch_ids":[],"spouse_id":"0","b_date":"0","d_date":"0","sex":"m","photo_url":"no_avatar.jpg","comment":""}]';
            var jsonObject = JSON.parse(json);
            var prof_id=50;
            var tree=[];
            var arr = jsonObject;
            for(key in arr){
                tree[arr[key].id] = arr[key];
                if(tree[arr[key].id].f_id == "0") {
                  tree[arr[key].id].f_id = "";
                }
                if(tree[arr[key].id].m_id == "0") {
                  tree[arr[key].id].m_id = "";
                }
                if(tree[arr[key].id].spouse_id == "0") {
                  tree[arr[key].id].spouse_id = "";
                }
                if(tree[arr[key].id].ch_ids == "[]") {
                  tree[arr[key].id].ch_ids = [];
                }
            }
            this.tree = tree;
            this.createTree(50, {'x':0,'y':0,'z':0}, 0);
            
            this.camera.position.x = Math.cos(this.rotation)*150;
            this.camera.position.z = Math.sin(this.rotation)*150;
            this.scene.add(this.camera);
            this.renderer.autoClear = false;
            this.animate(new Date().getTime());
            this.qwe = new Date().getTime();
              onmessage = function(ev) {
                paused = (ev.data == 'pause');
              }
		},
        createCube : function(x,y,z) {
            var cube = new THREE.Mesh(
              new THREE.CubeGeometry(20,20,20),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF})
            );
            cube.position.set(x,y,z);
            return cube;
        },
        
        createTree : function (id, position, i) {
            if(i==0) {
              var cube = this.createCube(position.x,position.y,position.z);
              this.scene.add(cube);
              if(this.tree[id].sex=='f') {
                this.lineGeo.vertices.push(
                  this.v(cube.position.x-20, cube.position.y, cube.position.z), this.v(cube.position.x+500, cube.position.y, cube.position.z)
                );
              } else {
                this.lineGeo.vertices.push(
                  this.v(cube.position.x, cube.position.y+20, cube.position.z), this.v(cube.position.x, cube.position.y-500, cube.position.z)
                );
              }
            }
            var unit={};
            i++;
            if(this.tree[id].spouse_id){
              if(this.tree[this.tree[id].spouse_id].sex=='f') {
                var cube2 = this.createCube(position.x-50,position.y-50,position.z);
                this.scene.add(cube2);
    
                this.lineGeo.vertices.push(
                  this.v(cube2.position.x-20, cube2.position.y, cube2.position.z), this.v(cube2.position.x+500, cube2.position.y, cube2.position.z)
                );
    
                this.unit = {'x':position.x, 'y':cube2.position.y, 'z':position.z};
              } else {
                var cube2 = this.createCube(position.x+50,position.y+50,position.z);
                this.scene.add(cube2);
    
                this.lineGeo.vertices.push(
                  this.v(cube2.position.x, cube2.position.y+20, cube2.position.z), this.v(cube2.position.x, cube2.position.y-500, cube2.position.z)
                );
    
                this.unit = {'x':cube2.position.x, 'y':position.y, 'z':position.z};
              }
            }
            if(this.tree[id].ch_ids){
              var arr = this.tree[id].ch_ids;
              //console.log(unit);
              this.lineGeo.vertices.push(
                  this.v(this.unit.x, this.unit.y, this.unit.z-20), this.v(this.unit.x, this.unit.y, this.unit.z+arr.length*50+70)
                );
              var cube3=[];
              for(key in arr){
                if(this.tree[arr[key]].sex=='m') {
                  cube3[key] = this.createCube(this.unit.x, this.unit.y-50, this.unit.z + 100 + key*50);
                  this.scene.add(cube3[key]);
                  this.lineGeo.vertices.push(
                    this.v(cube3[key].position.x, cube3[key].position.y+50, cube3[key].position.z), this.v(cube3[key].position.x, cube3[key].position.y-500, cube3[key].position.z)
                  );
                } else {
                  cube3[key] = this.createCube(unit.x+50, unit.y, unit.z + 100 + key*50);
                  this.scene.add(cube3[key]);
                  this.lineGeo.vertices.push(
                    this.v(cube3[key].position.x-50, cube3[key].position.y, cube3[key].position.z), this.v(cube3[key].position.x+500, cube3[key].position.y, cube3[key].position.z)
                  );
                }
                this.createTree(arr[key], cube3[key].position, i);
              }
            }
      },
      
      v : function (x,y,z){
        return new THREE.Vertex(new THREE.Vector3(x,y,z)); 
      },
      
      render: function(){
			this.renderer.render(this.scene, this.camera);
			
		},
      
      ////////////////////////////////////////////////////////////////////////////////////////
      paused : false,
      last : new Date().getTime(),
      down : false,
      sx : 0,
      sy : 0,
      rotation : 1,
      onmousedown : function (ev){
        if (ev.target == renderer.domElement) {
          this.down = true;
          sx = ev.clientX;
          sy = ev.clientY;
        }
      },
      onmouseup : function(){ this.down = false; },
      onmousemove : function(ev) {
        if (this.down) {
          var dx = ev.clientX - sx;
          var dy = ev.clientY - sy;
          this.rotation += dx/100;
          this.camera.position.x -= Math.cos(this.rotation)*150;
          this.camera.position.y += Math.sin(this.rotation)*150;
          sx += dx;
          sy += dy;
        }
      },
      onmousewheel : function(ev){
        camera.position.z -= event.originalEvent.wheelDeltaY;
      },
      
      
      animate : function (t) {
        if (!this.paused) {
          this.last = t;
          var gl = this.renderer.getContext();
          this.renderer.clear();
          this.camera.lookAt( this.scene.position );
          this.renderer.render(this.scene, this.camera);
          this.renderer.render(this.coordScene, this.camera);
        }
        requestAnimationFrame(this.animate, this.renderer.domElement);
      }
      
      
      ////////////////////////////////////////////////////////////////////////////////////////
        
	});
	return BaseView;
});