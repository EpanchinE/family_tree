//(function () {

	//var URL = 'js/app/templates/',
	//EJS = '.ejs'
		
define(['models/TreeNodeModel'],function(TreeModel){
    BaseView = Backbone.View.extend({
	//	var container, stats;
		//	var camera, scene, projector, renderer;
			//var cube;
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
		
		initialize: function(){
			//test model
			this._model = new TreeModel();
			console.log(this._model);
			this.treeObj = this._model.get('tree');
			console.log(this.treeObj);
			//tree = JSON.parse(this.treeObj);
			console.log(JSON.stringify(this.treeObj));		
		
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
				this.create_tree(this.tree, "1", 1);
				for(var key in this.objects) {
					this.objects[key].children[0].on('dblclick', function(event) {
						OSX.init_view(event.target.parent.info);
					});
				}
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
				/*renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
				renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);
				renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);*/
				//this.renderer.domElement.addEventListener('mousewheel', this.onDocumentMouseWheel, false);

			
},
		
		create_node: function (l_name, f_name, b_date, d_date, comment, photo_url, width, height){
					var cube = new THREE.Object3D();
					// TODO coords
					
					var photo = this.texture('trash/avatars/'+photo_url, 235, 235);
					photo.position.set(0, 30, 1);
					this.container.style.background = "url('trash/back_11111.jpg')";
					
					//parent "+"		
					var parVoxel = new THREE.Mesh(new THREE.PlaneGeometry(this.imgPlusSize, this.imgPlusSize));
					parVoxel.add(this.texture('trash/add.png', this.imgPlusSize, this.imgPlusSize));
					parVoxel.position.set(this.mouseX, this.mouseY - Math.floor(height / 2), 1);
					parVoxel.matrixAutoUpdate = false;
					parVoxel.updateMatrix();
					parVoxel.overdraw = true;
					//parVoxel.visible = false;
					parVoxel.children[0].material.map.image.src = 'trash/add_tr.png';
					parVoxel.name = 'parent';

					//child "+"
					var childVoxel = new THREE.Mesh(new THREE.PlaneGeometry(this.imgPlusSize, this.imgPlusSize));
					childVoxel.add(this.texture('trash/add.png', this.imgPlusSize, this.imgPlusSize));
					childVoxel.position.set(this.mouseX, this.mouseY + Math.floor(height / 2), 1);
					childVoxel.matrixAutoUpdate = false;
					childVoxel.updateMatrix();
					childVoxel.overdraw = true;
					//childVoxel.visible = false;
					childVoxel.children[0].material.map.image.src = 'trash/add_tr.png';
					childVoxel.name = 'child';
					
					// arrow
					var arrow = new THREE.Mesh(new THREE.PlaneGeometry(30, 48));
					arrow.add(this.texture('trash/arrow.png', 30, 48));
					arrow.position.set(this.mouseX, this.mouseY - 30 - Math.floor(height / 2), 1);
					arrow.overdraw = true;
					arrow.name = 'arrow';
					arrow.visible = false;
					//arrow.children[0].material.map.image.src = 'trash/arrow_tr.png';
					arrow.on('click', function() {console.log('arrow click');OSX.init(cube.info);}); // Dont work! Why?!!
					
					

					//edit
					var editVoxel = new THREE.Mesh(new THREE.PlaneGeometry(this.imgPlusSize, this.imgPlusSize));
					editVoxel.add(this.texture('trash/edit.png', this.imgPlusSize, this.imgPlusSize));
					editVoxel.position.set(this.mouseX+width/4, this.mouseY + Math.floor(height / 2), 1);
					editVoxel.matrixAutoUpdate = false;
					editVoxel.updateMatrix();
					editVoxel.overdraw = true;
					//editVoxel.visible = false;
					editVoxel.children[0].material.map.image.src = 'trash/edit_tr.png';
					editVoxel.name = 'edit';
					

					//delete
					var deleteVoxel = new THREE.Mesh(new THREE.PlaneGeometry(this.imgPlusSize, this.imgPlusSize));
					deleteVoxel.add(this.texture('trash/delete.png', this.imgPlusSize, this.imgPlusSize));
					deleteVoxel.position.set(this.mouseX-width/4, this.mouseY + Math.floor(height / 2), 1);
					deleteVoxel.matrixAutoUpdate = false;
					deleteVoxel.updateMatrix();
					deleteVoxel.overdraw = true;
					//deleteVoxel.visible = false;
					deleteVoxel.children[0].material.map.image.src = 'trash/delete_tr.png';
					deleteVoxel.name = 'delete';
					
					cube.add(this.texture('trash/polaroid.png', width*0.8, height));			// children[0]
					//cube.add(new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial( { color: 0xe0e0e0 } )));
					
					
					var minVal = -0.2;
					var maxVal = 0.2;
					var floatVal = 2;
					var randVal = minVal+(Math.random()*(maxVal-minVal));
					cube.rotation.z = typeof floatVal=='undefined'?Math.round(randVal):randVal.toFixed(floatVal);
					
				   
					cube.add(photo);												// children[1]
					cube.add(this.text(l_name, f_name, b_date, d_date, this.nodeWidth, this.nodeHeight));	// children[2]
					cube.add(parVoxel);											// children[3]
					cube.add(childVoxel);											// children[4]
					cube.add(arrow);												// children[5]
					cube.add(editVoxel);												// children[6]
					cube.add(deleteVoxel);												// children[7]
					cube.info = {
						"l_name" : l_name,
						"f_name" : f_name,
						"b_date" : b_date,
						"d_date" : d_date,
						"comment" : comment,
						"photo_url" : photo_url
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
		create_tree: function(json, id, i, nodex) {
					var data = JSON.parse(json);
					if(i == 1) {//TODO f_name
						console.log(data);
						var node = this.create_node(data[id].l_name, data[id].l_name, data[id].b_date, data[id].d_date, data[id].comment, data[id].photo_url, this.nodeWidth, this.nodeHeight);
						node.position.set(0, this.nodeHeight + 50, 0);
						node.info.user_id = id;
						node.generation = 1;
						this.objects.push(node);
						this.scene.add(node);
						nodex = node;
					}
					if(i < 4) {
						var a = i + 1;
						if(data[id].f_id) {
							var f_id = data[id].f_id;
							var f_node = this.create_node(data[f_id].l_name, data[f_id].l_name, data[f_id].b_date, data[f_id].d_date, data[f_id].comment, data[f_id].photo_url, this.nodeWidth, this.nodeHeight);
							f_node.position.set(nodex.position.x + (Math.pow((4 - i), 1.25)) * (-this.nodeWidth), (i - 1) * (-this.nodeHeight - 50), 0);
							f_node.info.user_id = f_id;
							this.objects.push(f_node);
							this.scene.add(f_node);
							lineFc = this.create_line_c(0x000000,nodex,f_node);
							this.scene.add(lineFc);
							nodex.father = f_node;
							f_node.generation = i;
							nodex.lineF = lineFc;
							f_node.lineC = lineFc;
							f_node.child = nodex;
							if(i==3){
								f_node.children[5].visible = true;
								//f_node.children[5].children[0].material.map.image.src = 'trash/arrow.png';
							}
							this.create_tree(json, f_id, a, f_node);
						};
						if(data[id].m_id) {
							var m_id = data[id].m_id;
							var m_node = this.create_node(data[m_id].l_name, data[m_id].l_name, data[m_id].b_date, data[m_id].d_date, data[id].comment, data[id].photo_url, this.nodeWidth, this.nodeHeight);
							m_node.position.set(nodex.position.x + (Math.pow((4 - i), 1.25)) * this.nodeWidth, (i - 1) * (-this.nodeHeight - 50), 0);
							m_node.info.user_id = m_id;
							this.objects.push(m_node);
							this.scene.add(m_node);
							lineMc = this.create_line_c(0x000000,nodex,m_node);
							this.scene.add(lineMc);
							nodex.mother = m_node;
							m_node.generation = i;
							nodex.lineM = lineMc;
							m_node.lineC = lineMc;
							m_node.child = nodex;
							if(i==3){
								m_node.children[5].visible = true;
								//m_node.children[5].children[0].material.map.image.src = 'trash/arrow.png';
							}
							this.create_tree(json, m_id, a, m_node);
						};
					}
			},
		create_line_c: function(color,child,parent) {
					var lineMat = new THREE.LineBasicMaterial({
						color : color,
						opacity : 1,
						linewidth : 1
					});

					var geom = new THREE.Geometry();
					geom.vertices.push(new THREE.Vertex(new THREE.Vector3(child.position.x, child.position.y, -10)));
					geom.vertices.push(new THREE.Vertex(new THREE.Vector3(child.position.x, child.position.y - 200, -10)));
					geom.vertices.push(new THREE.Vertex(new THREE.Vector3(parent.position.x, child.position.y - 200, -10)));
					geom.vertices.push(new THREE.Vertex(new THREE.Vector3(parent.position.x, parent.position.y, -10)));
					line = new THREE.Line(geom, lineMat);
					return line;
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
		text: function(l_name, f_name, b_date, d_date, width, height) {
					var canvas = document.createElement('canvas');
					canvas.width = width;
					canvas.height = height;
					var context = canvas.getContext("2d");
					context.fillStyle = "black";
					context.font = 'italic 22px Arial Black';
					//TODO text align
					context.fillText(f_name, width * 0.2, height * 0.83);
					context.fillText(l_name, width * 0.5, height * 0.83);
					context.fillText(b_date, width * 0.3, height * 0.9);
					context.fillText(d_date, width * 0.55, height * 0.9);
					var tex = new THREE.Texture(canvas);
					tex.needsUpdate = true;
					var mat = new THREE.MeshBasicMaterial({
						map : tex,
						overdraw : true
					});
					mat.transparent = true;
					var item = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat);
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
                                data = JSON.parse(this.tree);
                                
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
                                                    "l_name": "fafaf",
                                                    "b_date": "13433",
                                                    "d_date": "365756",
                                                    "f_id": "",
                                                    "m_id": "",
                                                    "comment": "Lorem ipsum dolor sit amet...",
                                                    "photo_url": "image.jpg"
                                                };
                                 tree2 = JSON.stringify(addNode);
                                 this.create_tree(tree2,n_id,i,nodex);
                                 if (f_id){
                                    data[n_id].f_id = f_id;
                                    f_id = null;
                                 } else if (m_id) {
                                    data[n_id].m_id = m_id;
                                    m_id = null;
                                 }
                                 data[p_id] = addNode[p_id];
                                 this.tree = JSON.stringify(data);
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
					/*par = intersects[1].object.parent;
					for( j = 0; j < par.children.length; j++) {
						if(par.children[j].name == 'child' || par.children[j].name == 'parent') {
							par.children[j].visible = true;
						}
					}*/
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
//})();
