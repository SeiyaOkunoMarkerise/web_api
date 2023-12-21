$(function () {
  var Menu = Backbone.Model.extend({
    // urlRoot: "../../api/api.php",
    url: function(){
      return "../../api/menu/" + (this.id ? this.id : '');
    },
    // parse: function(response) {
    //   return response.data;
    // },
    defaults:{
      name: '何か',
    }
  });
  var Menus = Backbone.Collection.extend({
    model: Menu,
    url: function(){
      return "../../api/menu/"
    },
    parse: function(response) {
      return response.data;
    }
    });
  var MenuView = Backbone.View.extend({
    tagName:'li',
    initialize: function(){
      this.model.on('destroy', this.remove, this);
      this.model.on('edit', this.editOne, this);
      this.model.on('save', this.saveOne, this);
      this.model.on('cancel', this.cancel, this);
    },
    events: {
      'click .delete':'destroy',
      'click .edit':'editOne',
      'click .save': 'saveOne',
      'click .cancel':'cancel'
    },
    edit :function() {
    },
    destroy: function() {
      if (confirm("are you sure?")) {
        this.model.destroy();
      }
    },
    remove: function(){
      this.$el.remove();
    },
    
    template: _.template($('#menu-template').html()),
    editTemplate: _.template($('#editMenu-template').html()),
    render: function(){
      var template = this.template(this.model.toJSON());
      this.$el.html(template);
      return this;
    },

    renderEdit : function(){
      this.$el.append(this.editTemplate(this.model.toJSON()));
    },

    editOne: function(){
      if(confirm("編集しますか？")) {
        this.$el.empty();
        this.renderEdit();
      }
    },
    saveOne: function() { 
      var name = this.$el.find('#edit-name').val();
      this.model.set('name', name);
      this.model.save(null,{
        success: function() {alert("編集が成功しました")}
      });
      $('#menus').html(menusView.renderOne().el);
    },
    cancel: function(){
      $('#menus').html(menusView.renderOne().el);
    }
  });
  
    var MenusView = Backbone.View.extend({
      tagName: 'ul',
      initialize: function() {
      this.collection.on('add' ,this.renderAll, this);
    },
    // addNew: function(menu) {
      //   var menuView = new MenuView({model: menu});
      //   this.$el.append(menuView.render().el);
      // },
      renderAll: function() {
      this.collection.each(function(menu){
        var menuView = new MenuView({model: menu});
        this.$el.append(menuView.render().el);
      },this);
      return this;
    },
      renderOne: function() {
        this.$el.empty();
        this.collection.each(function(menu){
          var menuView = new MenuView({model: menu});
          this.$el.append(menuView.render().el);
        },this);
        return this;
      }
  });
  
  var AddMenuView = Backbone.View.extend({
    el:'#addMenu',
    events: {
      'click input[type="submit"]': 'submit'
    },
    submit: function(){
      var name = this.$('#name').val();
      var menu = new Menu({name: name});
      // this.collection.add(menu); 以下に変更
      menu.save(null,{
        success: function(model, response) {
          if(response.success){
            alert("メニューの保存に成功しました😊");
            alert("保存された名前:" +response.name);
            this.collection.add(model);
          }    
        }
      });
    }
  });
  
  var SearchMenuView = Backbone.View.extend({
  el:'#searchMenu',
  events: {
    'click input[type="submit"]': 'searchMenu'
  },
  searchMenu: function(event){
    event.preventDefault();
    var id = this.$('#id').val();
    var menu = new Menu({id: id});
    menu.fetch({
      success: function(model) {
        var menusView = new MenusView({ collection: new Menus([model]) });
        $('#menus').html(menusView.renderOne().el);
        alert("検索できました！")
      },
      error: function(model) {
        alert("データの取得に失敗しました" +response.responseText);
      }
    });
  }
});
  
  var menus = new Menus();
  menus.fetch({
    success: function(collection, response) {
      // alert("Fetch成功:",response)
      console.log(collection);
      console.log(response);
      var menusView = new MenusView({collection: menus});
      $('#menus').html(menusView.renderAll().el);
    },
    error: function(collection, response) {
      alert("データの取得に失敗しました",response.responseText);
    }
  });
  
  var menusView = new MenusView({collection: menus});
  var addMenuView = new AddMenuView({collection: menus});
  var searhMenuView = new SearchMenuView({collection: menus});
  
  $('#menus').html(menusView.renderAll().el);
});
