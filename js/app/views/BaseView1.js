define(['models/TreeNodeModel', 'collections/TreeCollection', 'models/TreeNodeModel1'],function(TreeModel, TreeCollection, TreeModel1){
    BaseView = Backbone.View.extend({
	
			objects : [],
			// array of NODES
			mouseX : 0,
			mouseY : 0,
			
			isMouseDown : false,
			onMouseDownPosition: null,
			//windowHalfX : window.innerWidth / 2,
			//windowHalfY : window.innerHeight / 2,
			mouse : new THREE.Vector2(),
			//mouseHover : false,
			nodeWidth : 360,
			nodeHeight : 350,			
			imgPlusSize : 70,
            SELECTED: null,
            tree: '{"1":{"l_name":"ffff","b_date":"123","d_date":"456","f_id":"2","m_id":"3","comment":"Lorem ipsum dolor sit amet...","photo_url":"image.jpg"},\n\
					"2":{"l_name":"father","b_date":"123","d_date":"456","f_id":"4","m_id":"5","comment":"Lorem ipsum dolor sit amet...","photo_url":"back_3.jpg"},\n\
					"3":{"l_name":"mot","b_date":"123","d_date":"456","f_id":"10","m_id":"","comment":"Lorem ipsum dolor sit amet...","photo_url":"image.jpg"},\n\
					"4":{"l_name":"fff1","b_date":"123","d_date":"456","f_id":"6","m_id":"7","comment":"Lorem ipsum dolor sit amet...","photo_url":"image.jpg"},\n\
					"5":{"l_name":"fff2","b_date":"123","d_date":"456","f_id":"8","m_id":"9","comment":"Lorem ipsum dolor sit amet...","photo_url":"back_3.jpg"},\n\
					"6":{"l_name":"fff2","b_date":"123","d_date":"456","f_id":"","m_id":"","comment":"Lorem ipsum dolor sit amet...","photo_url":"image.jpg"},\n\
					"7":{"l_name":"fff2","b_date":"123","d_date":"456","f_id":"","m_id":"","comment":"Lorem ipsum dolor sit amet...","photo_url":"image.jpg"},\n\
					"8":{"l_name":"fff2","b_date":"123","d_date":"456","f_id":"","m_id":"","comment":"Lorem ipsum dolor sit amet...","photo_url":"back_3.jpg"},\n\
					"9":{"l_name":"fff2","b_date":"123","d_date":"456","f_id":"","m_id":"","comment":"Lorem ipsum dolor sit amet...","photo_url":"image.jpg"},\n\
					"10":{"l_name":"fff2","b_date":"123","d_date":"456","f_id":"","m_id":"11","comment":"Lorem ipsum dolor sit amet...","photo_url":"back_3.jpg"},\n\
					"11":{"l_name":"fff2","b_date":"123","d_date":"456","f_id":"","m_id":"","comment":"Lorem ipsum dolor sit amet...","photo_url":"image.jpg"}}',
            
           
		
		events: {
			"mousedown canvas" : "onDocumentMouseDown",
			"mouseup canvas": "onDocumentMouseUp",
			"mousemove canvas" : "onDocumentMouseMove", 
			"mousewheel canvas" : "onDocumentMouseWheel",
			"click canvas": "onClick",
			//"click #osx-modal-content-edit": "submitFunc",
			"click #submit_person": "submitFunc"//?
			
		},
		add: function(model){
			console.log(model);
		},
		add1: function(model){
			console.log("model change");
		},
		initialize: function(){
			//test model
			this._model = new TreeModel();
			//console.log(this._model);
			this.treeObj = this._model.get('tree');
			//console.log(this.treeObj);
			//console.log(JSON.stringify(this.treeObj));	
			//this.model = new TreeModel1();
			//this.model.bind("change", this.add1)
			//this.collection = new TreeCollection({model: this.model});	
			this.collection = new TreeCollection();	
			this.collection.fetch({
    				success: $.proxy(function(collection) {
       						console.log(collection);
       						this.create_tree("1",1);
       						/*collection.each(function(model) {
            					$.ajax({
										url: "/server/api/add_node",
										type: "POST",
										data: {"json_response": JSON.stringify(model.toJSON())},
										success : function(data) {
											console.log(data);
											}
									});
       							});*/
       					},this)});      				
			//console.log(this.collection.get("1"));
			//this.collection.bind('add', this.add);
			//this.collection.add({id:"15",l_name:"name1",f_name:"name2",f_id:"",m_id:"",ch_ids:["11","12","13"],spouse_id:"1",b_date:"1989",d_date:"0",sex:"m",photo_url:null,comment:"comment"});
			//this.collection.add({id:"16",l_name:"name1",f_name:"name2",f_id:"",m_id:"",ch_ids:["11","12","13"],spouse_id:"1",b_date:"1989",d_date:"0",sex:"m",photo_url:null,comment:"comment"});
			//this.collection.add({id:"17",l_name:"name1",f_name:"name2",f_id:"",m_id:"",ch_ids:["11","12","13"],spouse_id:"1",b_date:"1989",d_date:"0",sex:"m",photo_url:null,comment:"comment"});
			//this.collection.bind('remove', this.add);
			//this.collection.remove({id:"17"});
			//console.log(this.collection.get("17"));
			//console.log(this.collection.get("15"));
			//console.log(this.collection.toJSON());
			//console.log(this.collection);
			//navigation
			$("#slider").slider({
				orientation : "vertical",
				value : 8599,
				min : 100,
				max : 9999,
				slide : $.proxy(function(event, ui) {
					this.camera.position.z = 10099 - ui.value;
				},this)
			});
			$('#navigator').on("click", "div", $.proxy(this.navigation, this));
				
				this.container = document.createElement('div');
				//this.el.append($("#navigator"));
				$(this.el).append(this.container);
				var info = document.createElement('div');
				this.el.appendChild(info);
				//$(this.container).append($("#osx-modal-data-edit"));
				this.scene = new THREE.Scene();
				this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
				this.camera.position.y = 150;
				this.camera.position.z = 1500;
				this.scene.add(this.camera);
				THREE.Object3D._threexDomEvent.camera(this.camera);
				//this.create_tree("1", 1);
                //this.create_spouse();
				/*for(var key in this.objects) {
					this.objects[key].children[0].on('dblclick', function(event) {
						OSX.init_view(event.target.parent.info);
					});
				}*/
				this.projector = new THREE.Projector();
				this.onMouseDownPosition = new THREE.Vector2();
				this.renderer = new THREE.CanvasRenderer();
				this.renderer.setSize(window.innerWidth, window.innerHeight);
				this.container.appendChild(this.renderer.domElement);
				this.stats = new Stats();
				this.stats.domElement.style.position = 'absolute';
				this.stats.domElement.style.top = '0px';
				this.stats.domElement.style.right = '0px';
				this.container.appendChild(this.stats.domElement);					
		},
		
		create_node: function (data){
					var cube = new THREE.Object3D();
					// TODO coords
					if(!photo_url){var photo_url = "image.jpg"};
					var photo = this.texture('trash/avatars/'+photo_url, 235, 235);
					photo.position.set(0, 30, 1);
					this.container.style.background = "url('trash/back_11111.jpg')";
					
					var elems = {
                        'parent': {
                            width: this.imgPlusSize, height: this.imgPlusSize, path: 'trash/add.png', trPath: 'trash/add_tr.png', posX: this.mouseX, posY: this.mouseY - Math.floor(this.nodeHeight / 2)
                        },
                        'child': {
                            width: this.imgPlusSize, height: this.imgPlusSize, path: 'trash/add.png', trPath: 'trash/add_tr.png', posX: this.mouseX, posY: this.mouseY + Math.floor(this.nodeHeight / 2)
                        },
                        //'arrow': {
                        //    width: 30, height: 48, path: 'trash/arrow.png', posX: this.mouseX, posY: this.mouseY - 30 - Math.floor(this.nodeHeight / 2)
                        //},
                        'edit': {
                            width: this.imgPlusSize, height: this.imgPlusSize, path: 'trash/edit.png', trPath: 'trash/edit_tr.png', posX: this.mouseX+this.nodeWidth/4, posY: this.mouseY + Math.floor(this.nodeHeight / 2)
                        },
                        'delete': {
                            width: this.imgPlusSize, height: this.imgPlusSize, path: 'trash/delete.png', trPath: 'trash/delete_tr.png', posX: this.mouseX-this.nodeWidth/4, posY: this.mouseY + Math.floor(this.nodeHeight / 2)
                        }
                    };
					
					cube.add(this.texture('trash/polaroid.png', this.nodeWidth*0.8, this.nodeHeight));			// children[0]					
					
					var minVal = -0.2;
					var maxVal = 0.2;
					var floatVal = 2;
					var randVal = minVal+(Math.random()*(maxVal-minVal));
					cube.rotation.z = typeof floatVal=='undefined'?Math.round(randVal):randVal.toFixed(floatVal);
					
				   
					cube.add(photo);			// children[1]
					cube.add(this.text(data));	// children[2]
					
                    for(var key in elems){
                        cube.add(this.nodeElement(elems[key], key));
                    }
					cube.info = {
						"l_name" : data.l_name,
						"f_name" : data.f_name,
						"b_date" : data.b_date,
						"d_date" : data.d_date,
						"comment" : data.comment,
						"photo_url" : data.photo_url
					};
					cube.mother;
					cube.father;
					cube.child;
					cube.lineM;
					cube.lineF;
					cube.lineC;
					cube.redrawLine = function(){
						if(cube.mother){
							cube.lineM.geometry.vertices[0].position.set(cube.position.x,cube.position.y,-10);
							cube.lineM.geometry.vertices[1].position.set(cube.position.x, cube.position.y - 200, -10);
							cube.lineM.geometry.vertices[2].position.set(cube.mother.position.x, cube.position.y - 200, -10);
						};
						if(cube.father){
							cube.lineF.geometry.vertices[0].position.set(cube.position.x,cube.position.y,-10);
							cube.lineF.geometry.vertices[1].position.set(cube.position.x, cube.position.y - 200, -10);
							cube.lineF.geometry.vertices[2].position.set(cube.father.position.x, cube.position.y - 200, -10);
						};
						if(cube.child){
						cube.lineC.geometry.vertices[2].position.set(cube.position.x, cube.child.position.y - 200, -10);
						cube.lineC.geometry.vertices[3].position.set(cube.position.x,cube.position.y,-10);
						};
					}
					return cube;
		},
        nodeElement: function(elem, name){
            var element = new THREE.Mesh(new THREE.PlaneGeometry(elem.width, elem.height));
			element.add(this.texture(elem.path, elem.width, elem.height));
			element.position.set(elem.posX, elem.posY, 1);
			element.matrixAutoUpdate = false;
			element.updateMatrix();
			element.overdraw = true;
			element.visible = true;
			if (elem.trPath) element.children[0].material.map.image.src = elem.trPath;
			element.name = name;
            return element;
        },
		width_spouse_for_m: 0,
        width_spouse_for_f: 0,
        
		create_tree: function(id, i, nodex) {
			var data2 = this._model.get("tree");
            var data = data2.tree;
			if(i == 1) {//TODO f_name
				//var node = this.create_node(data[id]);//var node = this.create_node(this.collection.get(id).toJSON);
				var node = this.create_node(this.collection.get(id).toJSON());
				node.position.set(0, this.nodeHeight + 50, 0);
				node.info.user_id = id;
				node.generation = 1;
				this.objects.push(node);
				this.scene.add(node);
				nodex = node;
			}
			if(i < 4) {
				var a = i + 1;
				//if(data[id].f_id) {//this.collection.get(id).toJSON().f_id
				if(this.collection.get(id).toJSON().f_id){
					//var f_id = data[id].f_id;//this.collection.get(id).toJSON().f_id
					var f_id = this.collection.get(id).toJSON().f_id;
					//var f_node = this.create_node(data[f_id]); //var node = this.create_node(this.collection.get(f_id).toJSON());
					var f_node = this.create_node(this.collection.get(f_id).toJSON());
					//if (data[f_id].ch_ids.length == 1) {//this.collection.get(id).toJSON().ch_ids.length
					if (this.collection.get(f_id).toJSON().ch_ids.length == 1){
						f_node.position.set(nodex.position.x + (Math.pow((4 - i), 1.25)) * (-this.nodeWidth), (i - 1) * (-this.nodeHeight - 50), 0);
						}
                    //if (data[f_id].ch_ids.length > 1){
                    if (this.collection.get(f_id).toJSON().ch_ids.length > 1){
                        //if (data[id].sex=="f"){
                        if (this.collection.get(id).toJSON().sex=="f"){
                            f_node.position.set(nodex.position.x, (i - 1) * (-this.nodeHeight - 50), 0);
                        }
                        //if (data[id].sex=="m"){
                        if (this.collection.get(id).toJSON().sex=="m"){
                            var norm =(Math.pow((4 - i), 1.25)) * (this.nodeWidth);
                            //var needed = (data[f_id].ch_ids.length*(this.nodeWidth+200)); 
                            var needed = (this.collection.get(f_id).toJSON().ch_ids.length*(this.nodeWidth+200));
                            if (norm < needed) {
                                f_node.position.set(nodex.position.x - needed, (i - 1) * (-this.nodeHeight - 50), 0);
                                if (i==2) this.width_spouse_for_f = needed;
                                //var dx = needed/(data[f_id].ch_ids.length - 1);
                                var dx = needed/(this.collection.get(f_id).toJSON().ch_ids.length - 1);
                            } else {
                                f_node.position.set(nodex.position.x - norm, (i - 1) * (-this.nodeHeight - 50), 0);
                                if (i==2) this.width_spouse_for_f = norm;
                                //var dx = norm/(data[f_id].ch_ids.length - 1);
                                var dx = norm/(this.collection.get(f_id).toJSON().ch_ids.length - 1);
                            }
                            //for (k=0; k < data[f_id].ch_ids.length; k++){
                            for (k=0; k < this.collection.get(f_id).toJSON().ch_ids.length; k++){
                                //if (data[f_id].ch_ids[k] != id){
                                if (this.collection.get(f_id).toJSON().ch_ids[k] != id){
                                   //var ch_id = data[f_id].ch_ids[k];
                                   var ch_id = this.collection.get(f_id).toJSON().ch_ids[k];
                                   //var ch_node = this.create_node(data[ch_id]);
                                   var ch_node = this.create_node(this.collection.get(ch_id));
                                   ch_node.position.set(nodex.position.x - k*dx, nodex.position.y, 0);
                                   //if (data[f_id].ch_ids.length == 2) ch_node.position.set(nodex.position.x - dx, nodex.position.y, 0);
                                   if (this.collection.get(f_id).toJSON().ch_ids.length == 2) ch_node.position.set(nodex.position.x - dx, nodex.position.y, 0);
                                   this.create_relation(0x000000,ch_node,f_node,"father","child",f_id,i-1);
				                }                                
                            }
                        }                                
                    }
                    this.create_relation(0x000000,nodex,f_node,"father","parent",f_id,i);
					//if(i==3){
					//	f_node.children[5].visible = true;
					//}
					this.create_tree(f_id, a, f_node);
				};
				//if(data[id].m_id) {
				if(this.collection.get(id).toJSON().m_id){
					//var m_id = data[id].m_id;
					var m_id = this.collection.get(id).toJSON().m_id;
					//var m_node = this.create_node(data[m_id]);
					var m_node = this.create_node(this.collection.get(m_id).toJSON());
					//if (data[m_id].ch_ids.length == 1) m_node.position.set(nodex.position.x + (Math.pow((4 - i), 1.25)) * this.nodeWidth, (i - 1) * (-this.nodeHeight - 50), 0);
					if (this.collection.get(m_id).toJSON().ch_ids.length == 1) m_node.position.set(nodex.position.x + (Math.pow((4 - i), 1.25)) * this.nodeWidth, (i - 1) * (-this.nodeHeight - 50), 0);
					//if (data[m_id].ch_ids.length > 1){
					if (this.collection.get(m_id).toJSON().ch_ids.length > 1){
                        //if (data[id].sex=="m"){
                        if (this.collection.get(id).toJSON().sex=="m"){
                            m_node.position.set(nodex.position.x, (i - 1) * (-this.nodeHeight - 50), 0);
                        }
                        //if (data[id].sex=="f"){
                        if (this.collection.get(id).toJSON().sex=="f"){
                            var norm =(Math.pow((4 - i), 1.25)) * (this.nodeWidth);
                            //var needed = (data[m_id].ch_ids.length*(this.nodeWidth+200)); 
                            var needed = (this.collection.get(m_id).toJSON().ch_ids.length*(this.nodeWidth+200));
                            if (norm < needed) {
                                m_node.position.set(nodex.position.x + needed, (i - 1) * (-this.nodeHeight - 50), 0);
                                if (i==2) this.width_spouse_for_m = needed;
                                //var dx = needed/(data[f_id].ch_ids.length - 1);
                                var dx = needed/(this.collection.get(f_id).toJSON().ch_ids.length - 1);
                            }else{
                                m_node.position.set(nodex.position.x + norm, (i - 1) * (-this.nodeHeight - 50), 0);
                                if (i==2) this.width_spouse_for_m = norm;
                                //var dx = norm/(data[f_id].ch_ids.length - 1);
                                var dx = norm/(this.collection.get(f_id).toJSON().ch_ids.length - 1);
                            }
                            //for (k=0; k < data[m_id].ch_ids.length; k++){
                            for (k=0; k < this.collection.get(m_id).toJSON().ch_ids.length; k++){
                                //if (data[m_id].ch_ids[k] != id){
                                if (this.collection.get(m_id).toJSON().ch_ids[k] != id){
                                    //var ch_id = data[m_id].ch_ids[k];
                                    var ch_id = this.collection.get(m_id).toJSON().ch_ids[k];
                                    //var ch_node = this.create_node(data[ch_id]);
                                    var ch_node = this.create_node(this.collection.get(ch_id).toJSON());
                                    ch_node.position.set(nodex.position.x + k*dx,nodex.position.y , 0);
                                    //if (data[m_id].ch_ids.length == 2) ch_node.position.set(nodex.position.x + dx, nodex.position.y, 0);
                                    if (this.collection.get(m_id).toJSON().ch_ids.length == 2) ch_node.position.set(nodex.position.x + dx, nodex.position.y, 0);
        							this.create_relation(0x000000,ch_node,m_node,"mother","child",m_id,i-1);
                                }                                
                            }
                        }
                    }
					this.create_relation(0x000000,nodex,m_node,"mother","parent",m_id,i);
					//if(i==3){
					//	m_node.children[5].visible = true;
					//}
					this.create_tree(m_id, a, m_node);
				};
			}
		},
        create_spouse: function(){
            var data2 = this._model.get("tree");
            var data = data2.tree;
            var id = data[data2.id].spouse_id;
            if (data[data2.id].sex == "m"){
                var dx = this.width_spouse_for_m + this.nodeWidth + 600;
            }else{
                var dx = -this.width_spouse_for_f - this.nodeWidth - 600;
            }
            var node = this.create_node(data[id]);
			for (var key in this.objects){
			    if (this.objects[key].info.user_id == data2.id) spouse_node = this.objects[key];
			}
            node.position.set(spouse_node.position.x + dx, spouse_node.position.y, 0);
			node.info.user_id = id;
			node.generation = 1;
			this.objects.push(node);
			this.scene.add(node);
			nodex = node;

			if(data[id].f_id) {
				var f_id = data[id].f_id;
				var f_node = this.create_node(data[f_id]);
				f_node.position.set(nodex.position.x - 300, spouse_node.position.y - this.nodeHeight - 50, 0);
				this.create_relation(0x000000,nodex,f_node,"father","parent",f_id,2);
			};
			if(data[id].m_id) {
				var m_id = data[id].m_id;
				var m_node = this.create_node(data[m_id]);
				m_node.position.set(nodex.position.x + 300, spouse_node.position.y - this.nodeHeight - 50, 0);
				this.create_relation(0x000000,nodex,m_node,"mother","parent",m_id,2);
			};
        },
		create_relation: function(color,child,parent,relation,adding,id,generation) {
					
    				if(adding == "parent"){
    				    parent.info.user_id = id;
                        parent.generation = generation;
    				    this.objects.push(parent);
    				    this.scene.add(parent);
    				}
                    if(adding == "child"){
    				    child.info.user_id = id;
                        child.generation = generation;
                        this.objects.push(child);
    				    this.scene.add(child);
    				}
                    
                    var lineMat = new THREE.LineBasicMaterial({
						color : color,
						opacity : 1,
						linewidth : 3
					});

					var geom = new THREE.Geometry();
					geom.vertices.push(new THREE.Vertex(new THREE.Vector3(child.position.x, child.position.y, -10)));
					geom.vertices.push(new THREE.Vertex(new THREE.Vector3(child.position.x, child.position.y - 200, -10)));
					geom.vertices.push(new THREE.Vertex(new THREE.Vector3(parent.position.x, child.position.y - 200, -10)));
					geom.vertices.push(new THREE.Vertex(new THREE.Vector3(parent.position.x, parent.position.y, -10)));
					line = new THREE.Line(geom, lineMat);
                    
                    this.scene.add(line);
					parent.lineC = line;
					parent.child = child;
                    if (relation == "mother"){
                        child.mother = parent;
                        child.lineM = line;
                    }
                    if (relation == "father"){
                        child.father = parent;
                        child.lineF = line;
                    }
		},
		texture: function(path, size_x, size_y) {
					var tex = THREE.ImageUtils.loadTexture(path);
					var mat = new THREE.MeshBasicMaterial({
						map : tex,
						overdraw : true
					});
					mat.transparent = true;
					var item = new THREE.Mesh(new THREE.PlaneGeometry(size_x, size_y), mat);
					return item;
		},
		text: function(data) {
					var canvas = document.createElement('canvas');
					canvas.width = this.nodeWidth;
					canvas.height = this.nodeHeight;
					var context = canvas.getContext("2d");
					context.fillStyle = "black";
					context.font = 'italic 22px Arial Black';
					//TODO text align
					context.fillText(data.f_name, this.nodeWidth * 0.2, this.nodeHeight * 0.83);
					context.fillText(data.l_name, this.nodeWidth * 0.5, this.nodeHeight * 0.83);
					context.fillText(data.b_date, this.nodeWidth * 0.3, this.nodeHeight * 0.9);
					context.fillText(data.d_date, this.nodeWidth * 0.55, this.nodeHeight * 0.9);
					var tex = new THREE.Texture(canvas);
					tex.needsUpdate = true;
					var mat = new THREE.MeshBasicMaterial({
						map : tex,
						overdraw : true
					});
					mat.transparent = true;
					var item = new THREE.Mesh(new THREE.PlaneGeometry(this.nodeWidth, this.nodeHeight), mat);
					item.position.z = 1;
					return item;
		},
		onDocumentMouseDown: function(event) {

				event.preventDefault();
				var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
				this.projector.unprojectVector(vector, this.camera);
				var ray = new THREE.Ray(this.camera.position, vector.subSelf(this.camera.position).normalize());
				var intersects = ray.intersectObjects(this.objects);
				if(intersects.length > 0) {
					this.SELECTED = intersects[0].object.parent;
				} else {
					this.isMouseDown = true;
					this.container.style.cursor = 'move';
					this.SELECTED = null;
				}
				this.onMouseDownPosition.x = event.clientX;
				this.onMouseDownPosition.y = event.clientY;
		},
		
		onClick: function(event) {
				event.preventDefault();
				//test
				//this.collection.add({id:"16",l_name:"name1",f_name:"name2",f_id:"",m_id:"",ch_ids:["11","12","13"],spouse_id:"1",b_date:"1989",d_date:"0",sex:"m",photo_url:null,comment:"comment"});
				//this.collection.get("16").set({l_name:"name3334",f_name:"name2222"});
				//this.collection.get("15").trigger("change");
				//this.collection.remove({id:"15"});
				console.log(this.collection.get("1").toJSON().ch_ids.length);
				//console.log(this.collection.get("1"));
				
				var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
				this.projector.unprojectVector(vector, this.camera);
				var ray = new THREE.Ray(this.camera.position, vector.subSelf(this.camera.position).normalize());
				var intersects = ray.intersectObjects(this.objects);
				if(intersects.length > 0) {
					for(i = 0; i < intersects.length; i++)
					{
						if(intersects[i].object.name == 'child') {
							OSX.init_edit({"action": 'add_child'}, intersects[i].object.parent);
						}
						else if(intersects[i].object.name == 'parent')
						{	/////////////////////////////////////   ADDING PARENT    /////////////////////////////////////////
                            if (!intersects[0].object.parent.father || !intersects[0].object.parent.mother){
                                nodex = intersects[i].object.parent;
                                i = nodex.generation+1;
                                var n_id = nodex.info.user_id;
                                var p_id = this.objects.length+1;
                               // data = JSON.parse(this.tree);
                                data = this.treeObj;
                                if (data[n_id].f_id == ""){
                                    var m_id = data[n_id].m_id;
                                    data[n_id].m_id = "";
                                    data[n_id].f_id = p_id;
                                } else if (data[n_id].m_id == ""){
                                    var f_id = data[n_id].f_id;
                                    data[n_id].f_id = "";
                                    data[n_id].m_id = p_id;
                                }
                                var addNode = {};
                                addNode[n_id] = data[n_id];
                                addNode[p_id] = {
                                                    "l_name":"newName",
                                                    "f_name":"newfname",
                                                    "f_id":"",
                                                    "m_id":"",
                                                    "ch_ids": n_id,
                                                    "spouse_id":"",
                                                    "b_date":"1920",
                                                    "d_date":"0",
                                                    "sex":"f",
                                                    "photo_url":"back_3.jpg",
                                                    "comment":"comment"
                                                };
                                 //tree2 = JSON.stringify(addNode);
                                 this.create_tree(addNode,n_id,i,nodex);
                                 if (f_id){
                                    data[n_id].f_id = f_id;
                                    f_id = null;
                                 } else if (m_id) {
                                    data[n_id].m_id = m_id;
                                    m_id = null;
                                 }
                                 data[p_id] = addNode[p_id];
                                 this.treeObj = data;
                                 this._model.update("tree",this.treeObj);
                                 console.log(this._model.get("tree",this.treeObj));
								 OSX.init_edit({"action": 'add_parent'}, nodex);
                            }                            
                            //////////////////////////////////////////////////////////////////////////////////////////////////
						} else if(intersects[i].object.name == 'edit')
						{
							//edit persone 
							nodex = intersects[i].object.parent;
							OSX.init_edit({'action': 'edit_person'}, nodex);
						}else if(intersects[i].object.name == 'delete')
						{
							// delete node
						}
					}
                    
				} else {
					
				}
		},
		
		onDocumentMouseMove: function(event) {
				event.preventDefault();
				this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
				this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
				var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
				this.projector.unprojectVector(vector, this.camera);
				var ray = new THREE.Ray(this.camera.position, vector.subSelf(this.camera.position).normalize());
				var intersects = ray.intersectObjects(this.objects);

				if( intersects.length > 0 ) {
					this.container.style.cursor = 'pointer';
					if(intersects.length >1)
					{
						par = intersects[1].object.parent;
						for( j = 0; j < par.children.length; j++) {
							if(par.children[j].name == 'child') {
								//par.children[j].visible = true;
								par.children[j].children[0].material.map.image.src = 'trash/add.png';
							}else if(par.children[j].name == 'parent') {
								//par.children[j].visible = true;
								par.children[j].children[0].material.map.image.src = 'trash/add.png';
							}else if(par.children[j].name == 'edit') {
								//par.children[j].visible = true;
								par.children[j].children[0].material.map.image.src = 'trash/edit.png';
							}else if(par.children[j].name == 'delete') {
								//par.children[j].visible = true;
								par.children[j].children[0].material.map.image.src = 'trash/delete.png';
							}
						}
					}
                    if(this.SELECTED == intersects[0].object.parent) {
						this.container.style.cursor = 'pointer';
						var deltaX = -(event.clientX - this.onMouseDownPosition.x) * this.camera.position.z / 450;
						var deltaY = (event.clientY - this.onMouseDownPosition.y) * this.camera.position.z / 450;
						this.mouseX -= deltaX;
						this.mouseY += deltaY;
						this.onMouseDownPosition.x = event.clientX;
						this.onMouseDownPosition.y = event.clientY;
						intersects[0].object.parent.position.x -= deltaX;
						intersects[0].object.parent.position.y -= deltaY;
						intersects[0].object.parent.redrawLine();
					}
                    
				} else {
					
                    if(!this.SELECTED){
                        for( i = 0; i < this.objects.length; i++) {
    						for( j = 0; j < this.objects[i].children.length; j++) {
    							if(this.objects[i].children[j].name == 'child') {
									//par.children[j].visible = true;
									this.objects[i].children[j].children[0].material.map.image.src = 'trash/add_tr.png';
								}else if(this.objects[i].children[j].name == 'parent') {
									//par.children[j].visible = true;
									this.objects[i].children[j].children[0].material.map.image.src = 'trash/add_tr.png';
								}else if(this.objects[i].children[j].name == 'edit') {
									//par.children[j].visible = true;
									this.objects[i].children[j].children[0].material.map.image.src = 'trash/edit_tr.png';
								}else if(this.objects[i].children[j].name == 'delete') {
									//par.children[j].visible = true;
									this.objects[i].children[j].children[0].material.map.image.src = 'trash/delete_tr.png';
								}
    						}
    					}
    					this.container.style.cursor = 'auto';
    					if(this.isMouseDown) {
    						this.container.style.cursor = 'move';
    						var deltaX = -(event.clientX - this.onMouseDownPosition.x);
    						var deltaY = event.clientY - this.onMouseDownPosition.y;
    						this.camera.position.x += deltaX * this.camera.position.z / 450;
    						this.camera.position.y += deltaY * this.camera.position.z / 450;
    						this.onMouseDownPosition.x = event.clientX;
    						this.onMouseDownPosition.y = event.clientY;
    						this.camera.updateMatrix();
    					} else {
    						this.container.style.cursor = 'auto';
    					}
                    } else {
   						var deltaX = -(event.clientX - this.onMouseDownPosition.x) * this.camera.position.z / 450;
						var deltaY = (event.clientY - this.onMouseDownPosition.y) * this.camera.position.z / 450;
						this.mouseX -= deltaX;
						this.mouseY += deltaY;
						this.onMouseDownPosition.x = event.clientX;
						this.onMouseDownPosition.y = event.clientY;
						this.SELECTED.position.x -= deltaX;
						this.SELECTED.position.y -= deltaY;
						this.SELECTED.redrawLine();
                    }
                    
				}
		},
		
		onDocumentMouseUp: function(event) {
				this.SELECTED = null;
				this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
				this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
				var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
				this.projector.unprojectVector(vector, this.camera);
				var ray = new THREE.Ray(this.camera.position, vector.subSelf(this.camera.position).normalize());
				var intersects = ray.intersectObjects(this.objects);
				if(intersects.length > 0) {
					this.container.style.cursor = 'pointer';
				} else {
					this.container.style.cursor = 'auto';
					this.isMouseDown = false;
					this.onMouseDownPosition.x = event.clientX - this.onMouseDownPosition.x;
					this.onMouseDownPosition.y = event.clientY - this.onMouseDownPosition.y;
				}
		},
		
		onDocumentMouseWheel: function(event) {
			
				if(this.camera.position.z > 0)
					this.camera.position.z -= event.originalEvent.wheelDeltaY;
				if(this.camera.position.z < 100)
					this.camera.position.z = 101;
				if(this.camera.position.z > 10000)
					this.camera.position.z = 9999;
				this.camera.updateMatrix();
		},
		
		navigation: function(event) {
				//console.log(event.target);
				event.preventDefault();
				switch (event.target.id) {
					case "arrowdown":
						this.camera.position.y -= 10;
						break;
					case "arrowup":
						this.camera.position.y += 10;
						break;
					case "arrowright":
						this.camera.position.x += 10;
						break;
					case "arrowleft":
						this.camera.position.x -= 10;
						break;
					case "plus":
						if(this.camera.position.z > 100)
							this.camera.position.z -= 10;
						break;
					case "minus":
						if(this.camera.position.z < 9999)
							this.camera.position.z += 10;
						break;
				};						
		},
		animate: function() {
				requestAnimationFrame($.proxy(this.animate, this));
				this.render();
				this.stats.update();
				
		},
		render: function(){
			$("#slider").slider("value", 10099 - this.camera.position.z);
			this.renderer.render(this.scene, this.camera);
			
		},
		submitFunc: function(event){
			event.preventDefault();
			console.log("submit ");
		}
		
	});
	return BaseView;
});
