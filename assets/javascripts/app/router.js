define(['controllers/login_controller', 'controllers/TreeController', 'controllers/Tree3dController', 'models/login_model'], function(loginController, TreeController, Tree3DController, LoginModel) {
	return Backbone.Router.extend({

		initialize : function () {
			this._container = $('#wr');
			this._currentController = null;
			this.model = new LoginModel();
			//this.model.checkLogin();
			console.log("router");
		},
		
		routes : {
			"tree" 		: "tree",
			"tree3d"	: "tree3d",
			"*actions"  : "login"
		},
		
		_runController : function (ControllerConstructor) {
			if (this._currentController) {
				this._currentController.destroy();
			}
			this._container.empty();
			this._currentController = new ControllerConstructor({el : this._container});
		},
		
		login : function () {
			this._runController(loginController);
		},
		
		tree : function () {
			this._runController(TreeController);console.log("router tree");
		},
		
		tree3d : function () {
			this._runController(Tree3DController);console.log("router tree3d");
		}
		
	});

});
