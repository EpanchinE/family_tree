define(['views/BaseView2','models/BaseModel'], function(BaseView, BaseModel){
    return Backbone.View.extend({
		
		initialize : function(options) {
			this.el = options.el;
			this.model = new BaseModel();
			this.getView(this.model.get("url"));
			$("#birth_date").datepicker({ changeYear: true, yearRange: '1900:2050', createButton:false, clickInput:true });
			$("#view3d").off();
			this._view    = new BaseView({el : this.el, model : this.model});
			this.start();
			console.log("tree3d");
		},
		destroy : function () {
			this.el.empty();
			this._view.unbind();
			this.unbind();
		},
		
		getView : function (url) {
			$.ajaxSetup({cache : false});
			$.ajaxSetup({async : false});
			$.ajax({
				url : url,
				success : $.proxy(this.renderView, this)
			});
		},
		
		renderView : function (template) {
			this.el.append(template);
			//this.delegateEvents();
		},
		
		start: function(){
			this._view.animate();
		}
	});
});
