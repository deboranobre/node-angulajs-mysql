
var app = angular.module('collections', []);

app.controller('collectionCTRL', function ($scope, $http) {
    
    $scope.loader = {
        loading: false
    };
    
    $scope.showCreateForm = function () {
        $scope.clearForm();
        $('#modal-collection-title').text('Adicionar Novo Catálogo');
        $('#btn-update-collection').hide();
        $('#btn-create-collection').show();

        $('#record-list').hide();
        $('#form-record').hide();
    };

    $scope.clearForm = function () {
        $scope.id = "";
        $scope.name = "";
        $scope.description = "";
        $scope.modalstatustext = "";
    };
    
    $scope.hideFormFields = function () {
        $('#form-dinminder').hide();
    };
    
    $scope.showFormFields = function () {
        $('#form-dinminder').show();
    };

    $scope.getAll = function () {
        
        $scope.loader.loading = true;
        
        $http.get("api/list")
            .success(function (response) {
                if (response.error === 2) {
					$scope.statustext = "Não há nenhum catálogo cadastrado.";
					$scope.loader.loading = false;
				} else {
					$scope.names = response.collections;
					$scope.loader.loading = false;
					$scope.statustext = "";
				}
            })
            .error(function (data, status, headers, config) {
                $scope.loader.loading = false;
                $scope.statustext = "Ocorreu um erro. Por favor verifique a conexão com o banco de dados.";
            });
    };

    $scope.readOne = function (id) {
        $scope.clearForm();
        $scope.hideFormFields();
        
        $('#modal-collection-title').text("Editar Catálogo");
        $('#btn-update-collection').show();

        $('#btn-create-collection').hide();
        $scope.loader.loading = true;

        $('#record-list').show();
        $('#form-record').hide();

        // get id 
        $http.get('api/list/' + id)
            .success(function (data, status, headers, config) {
                $scope.showFormFields();
                
                $scope.id = data.collection[0].id;
                $scope.name = data.collection[0].name;
                $scope.description = data.collection[0].description;

                $('#myModal').modal('show');
                $scope.loader.loading = false;

                $scope.getAllRecords(id);
            })
            .error(function (data, status, headers, config) {
                $scope.loader.loading = false;
                $scope.modalstatustext = "Ocorreu um erro ao obter os dados";
            });
    };

    // Create Collection
    $scope.createCollection = function () {
        
        $scope.loader.loading = true;

        $http.post('/api/insert', {
            'name' : $scope.name,
            'description' : $scope.description
        })
            .success(function (data, status, headers, config) {
                $('#myModal').modal('hide');
                $scope.clearForm();
                $scope.getAll();
            })
            .error(function (data, status, headers, config) {
                $scope.loader.loading = false;
                $scope.modalstatustext = "Não foi possível atualizar os dados!";
            });
    };
	
	// update collection  / save changes
    $scope.updateCollection = function () {
        
        $scope.loader.loading = true;
        
        $http.put('/api/update', {
            'id' : $scope.id,
            'name' : $scope.name,
            'description' : $scope.description,
            'price' : $scope.price
        })
            .success(function (data, status, headers, config) {
                $('#myModal').modal('hide');
                $scope.clearForm();

                // refresh the collection list
                $scope.getAll();
            })
            .error(function (data, status, headers, config) {
                $scope.loader.loading = false;
                $scope.modalstatustext = "Não foi possível atualizar o registro!";
            });
    };

    //Delete collection
    $scope.deleteCollection = function (id) {
        $scope.loader.loading = true;
		
        $http.post('/api/delete', {
            'id' : id
        })
            .success(function (data, status, headers, config) {
                $('#confirm' + id).modal('hide');
                $scope.getAll();
            })
            .error(function (data, status, headers, config) {
                $scope.modalstatustext = "Não foi possível excluir registro!";
				// refresh the list
                $scope.getAll();
            });
    };

    //Records
    $scope.showCreateRecordForm = function () {
        $scope.clearRecordForm();
        $('#form-record').show();

        $('#btn-update-record').hide();
        $('#btn-create-record').show();
    };

    $scope.clearRecordForm = function () {
        $scope.title = "";
        $scope.artist = "";
        $scope.year = "";
        $scope.modalstatustext = "";
    };

    // Create Record
    $scope.createRecord = function () {

        if($scope.id){
            $http.post('/api/insertRecord', {
                'collection_id' : $scope.id,
                'title' : $scope.title,
                'artist' : $scope.artist,
                'year' : $scope.year
            })
                .success(function (data, status, headers, config) {
                    $('#form-record').hide();
                    $scope.clearRecordForm();
                    
                    $scope.getAllRecords($scope.id);
                })
                .error(function (data, status, headers, config) {
                    $scope.loader.loading = false;
                    $scope.modalstatustext = "Não foi possível atualizar os dados!";
                });
        }
    };

    $scope.getAllRecords = function (collection_id) {
        
        $http.get('api/listRecords/' + collection_id)
            .success(function (response) {
                if (response.error === 2) {
					//$scope.statustext = "Não há nenhum catálogo cadastrado.";
				} else {
					$scope.records = response.records;
					
                    //$scope.loader.loading = false;
					//$scope.statustext = "";
				}
            })
            .error(function (data, status, headers, config) {
                $scope.loader.loading = false;
                $scope.statustext = "Ocorreu um erro. Por favor verifique a conexão com o banco de dados.";
            });
    };

    $scope.readOneRecord = function (id) {
        $scope.clearRecordForm();
       
        // get id 
        $http.get('api/listRecordById/' + id)
            .success(function (data, status, headers, config) {
                
                $scope.title = data.record[0].title;
                $scope.artist = data.record[0].artist;
                $scope.year = data.record[0].year;
                $scope.record_id = data.record[0].id;

                $('#form-record').show();
                $('#btn-update-record').show();
                $('#btn-create-record').hide();
            })
            .error(function (data, status, headers, config) {
                $scope.modalstatustext = "Ocorreu um erro ao obter os dados";
            });
    };

    // update record 
    $scope.updateRecord = function () {

        $http.put('/api/updateRecord', {
            'id' : $scope.record_id,
            'title' : $scope.title,
            'artist' : $scope.artist,
            'year' : $scope.year,
            'collection_id' : $scope.id
        })
            .success(function (data, status, headers, config) {
                $('#form-record').hide();
                $scope.clearRecordForm();

                // refresh the record list
                $scope.getAllRecords($scope.id);
            })
            .error(function (data, status, headers, config) {
                $scope.loader.loading = false;
                $scope.modalstatustext = "Unable to Update data!";
            });
    };

    //Delete record
    $scope.deleteRecord = function (id) {
        $http.post('/api/deleteRecord', {
            'id' : id
        })
            .success(function (data, status, headers, config) {
                $scope.getAllRecords($scope.id);
            })
            .error(function (data, status, headers, config) {
                $scope.modalstatustext = "Não foi possível excluir registro!";
				// refresh the list
                $scope.getAllRecords($scope.id);
            });
    };
});