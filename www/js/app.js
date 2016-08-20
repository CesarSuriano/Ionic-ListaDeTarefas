
angular.module('todo', ['ionic'])

.run(function($ionicPlatform, DB) {
  DB.getConnection(function(tx){
    DB.createTables(tx, function(){
      console.log("Criou as tabelas");
    });
  });


  $ionicPlatform.ready(function() {

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
     
      StatusBar.styleDefault();
    }
  });
})

 .service('DB', function(){
  var db = null;

  this.getConnection = function(cb){
    if(db == null){
      db = openDatabase('todolist', 1, 'todolist database', 2097152);
    }
    
    db.transaction(function(tx){
      cb(tx);
    })
  }

    this.createTables = function(tx, cb){
      //con.transaction(function(tx){
        var SQL = "CREATE TABLE IF NOT EXISTS todo(id INTEGER PRIMARY KEY, todo TEXT, status NUMBER)"
        tx.executeSql(SQL,[], function(success){
          cb();
        },function(error){
          console.log("Erro: ", error);
          cb();
        })
      //}
      //)
  }
})

.controller('TodoCtrl', function($scope, DB){
  function loadTodos(){
     DB.getConnection(function(tx){

      //con.transaction(function(tx){
        var SQL = "SELECT * FROM TODO"
        tx.executeSql(SQL, [], function(tx, todosDB){

          //fffff
          var todos = [];
          var todosDB = todosDB.rows;

          for(var i=0; i < todosDB.length; i++){
            todos.push(todosDB[i]);
          }

          //ffffffff

          //Enviar a todos para view
          $scope.todos = todos;
          $scope.$digest();
        })
      //})
    })
  }

  loadTodos();

 

  $scope.add = function(){
    if(!$scope.todoStr){
      alert("Informe o campo");
      return;
    }

    DB.getConnection(function(tx){
     // con.transaction(function(tx){
        var SQL = "INSERT INTO todo (todo, status) VALUES(?,?)"
        tx.executeSql(SQL, [$scope.todoStr, true], function(tx, insert){
            loadTodos();
          $scope.todoStr = "";
        }, function(error, e){
          console.log(error, e);
        })
      })
   // })
  //  console.log($scope.todoStr);
  // if(!$scope.todoStr){
  // //   alert("Informe o campo");
  // //   return;
  // // }
  
  // //   $scope.todos.push({
  // //     todo: $scope.todoStr,
  // //     status:false
  // //   })
  // //   $scope.todoStr = "";
  // }
}
  $scope.excluir = function(id){
    if(confirm('Deseja excluir')){
      DB.getConnection(function(tx){
        tx.executeSql("DELETE FROM TODO WHERE ID = ?", [id], function(tx, success){
          console.log("Sucesso". success);
          loadTodos();
        },function(tx, err){
          console.log("Err", err);
        })
      })
    //})
  }
}
    
    
})
