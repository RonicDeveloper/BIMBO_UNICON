<?php
date_default_timezone_set('America/Mexico_City');
setlocale(LC_TIME, "es_MX.UTF-8","es_ES.UTF-8","es_ES","es_MX");
class DataSource {
    // BASE DE DATOS CONTINENTAL
	protected $host 			= "localhost";//"localhost";
	protected $user 			= "tarahumara";
	protected $pass 			= "Pywq#7205";
	protected $hostLocal 		= "127.0.0.0";
	protected $userLocal 		= "root";
	protected $passLocal 		= "";
	protected $database 		= "randomestudio_tarahumara"; 
	private   $localConnection 	= false;
	private   $connection;

	public function __construct($useLocalHost = false){
		$this->localConnection = $useLocalHost;
	}
	
	private function connect(){
		$this->connection = new mysqli($this->host, $this->user, $this->pass,$this->database);
		//$this->connection = new mysqli("localhost:3306", "root", "","ronic_menu_tv");
		$this->connection->set_charset('utf8');
	}
	
	private function disconnect(){
		$this->connection->close();
	}
	
	public function query($query,$returnId = false){
		$this->connect();
		$result = $this->connection->query($query);
		if($returnId) return $this->connection->insert_id;
		$this->disconnect();
		return $result;
	}
	
	public function updateSQL($table,$params,$idName,$condition,$id){
        $values = "";
        foreach( $params as $key => $value){
          	if($key!=$idName) $values .= $key."='".$value."',";
        }
		
        $values = substr($values,0,-1);
		$qry 	= "update ".$table." set ".$values." where ".$idName.$condition."'".$id."'"; 
		$result = new stdClass();
		
		$result->success = $this->query($qry);
		$result->query 	 = $qry;
		return $result;
	}
	
	public function updateSQLWCH($table,$params,$idName,$condition,$id){
        $values = "";
		$tableFields = $this->getFields($table);   
        foreach( $params as $key => $value){
			if($this->searchField($tableFields,$key)){
				if($key!=$idName) $values .= $key."='".$value."',";
			}
        }

        $values = substr($values,0,-1);
		$qry 	= "update ".$table." set ".$values." where ".$idName.$condition."'".$id."'"; 
		
		$result 				= new stdClass();
		$resId 					= $this->query($qry);
		$result->success 		= ($resId?true:false);
		$result->insertedId 	= $id;
		$result->query 			= $qry;
		return $result;
	}
	
	
        
	public function insertSQL($table,$params,$resId = false,$debug=false){
		$fields = "";
		$values = "";
        foreach( $params as $key => $value){
        	$fields .= $key.",";
            $values .= "'".utf8_decode($value)."',";
        }
		$qry = "insert into ".$table." (".substr($fields,0,-1).") values(".substr($values,0,-1).")";
		if($debug){
		 	return $qry;
		}
        return $this->query($qry,$resId);
    }

	public function insertSQLWCH($table,$params){
		$fields = "";
		$values = "";
		$tableFields = $this->getFields($table);   
        foreach( $params as $key => $value){
			if($this->searchField($tableFields,$key)){
				$fields .= $key.",";
				$values .= "'".utf8_decode($value)."',";
			}
        }
		$qry = "insert into ".$table." (".substr($fields,0,-1).") values(".substr($values,0,-1).")";
			
		$result 				= new stdClass();
		$resId 					= $this->query($qry,true);
		$result->success 		= ($resId?true:false);
		$result->insertedId 	= $resId;
		$result->query 			= $qry;
		
		return $result;
		
    }
	
	public function deleteSQL($table,$tableId,$id){
		$qry 					= "delete from ".$table." where ".$tableId." = '".$id."'";	
		$result 				= new stdClass();
		$result->success 		= $this->query($qry);
		$result->query 			= $qry;
		return $result;	
    }

	public function getFields($table){
		$res =   $this->query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.Columns where TABLE_NAME = '".$table."'");
		$fields = array();
		while($row=$res->fetch_object()){
			array_push($fields,$row->COLUMN_NAME);
		}
		return $fields;
	}
	
	public function searchField($tableFields,$key){		
		for($n=0;$n<count($tableFields);$n++){
			if($tableFields[$n] == $key) return true;
		}
		return false;
	}
	
	public function sortData($resultQuery, $tableNam){
		$arrayfields	= $this->getFields($tableNam);
		
		while ($infoRow = $resultQuery->fetch_assoc()) {
      			foreach ($arrayfields as $key) {
        			$dataSorted[$key][]   = ($infoRow[$key]);
      			}
    	}
		return $dataSorted;
	}
	
	
}


?>