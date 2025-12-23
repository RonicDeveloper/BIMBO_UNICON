<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
if($_SERVER['REQUEST_METHOD'] == "OPTIONS") die();

require_once("DataSource.php");
include "qrcode/qrlib.php"; // DEM


$path =  $_SERVER['DOCUMENT_ROOT']."/___Services/_qrs/";
$ds					= new DataSource();


if(!isset($_POST['params'])){
	$params 			= new stdClass();
	$params->method		= "loginUser";
	$params->idSite		= 1;
}else{
	$params 			= json_decode($_POST['params']);
}



$result 			= new stdClass();
$result->success 	= false;
$result->error 		= 400;
$result->errorMsg 	= "No method given";
$result->data		= "";
$result->token		= "";

//----------------------------- REQUIRED METHDS --------------------------
//UPDATED

function getBetween($content,$start,$end){
    $r = explode($start, $content);
    if (isset($r[1])){ 
        $r = explode($end, $r[1]);
        return $r[0];
    }
    return '';
}



function fill($num,$size){
	$fill = "";
	for($n=0;$n<($size-strlen($num.""));$n++){
		$fill .= "0";
	}
	$preCode = $fill.$num;	
	return $preCode;
}


function crc16($data){
   $crc = 0xFFFF;
   for ($i = 0; $i < strlen($data); $i++){
     $x = (($crc >> 8) ^ ord($data[$i])) & 0xFF;
     $x ^= $x >> 4;
     $crc = (($crc << 8) ^ ($x << 12) ^ ($x << 5) ^ $x) & 0xFFFF;
   }
   return $crc;
 }

function createCode($emp,$counter){
	$part1 	= fill(base_convert($emp,10,36),2);
	$part2 	= fill(base_convert($counter,10,36),5);
	$dv 	= fill(base_convert(crc16($part1.$part2),10,35),4);
	return strtoupper($part1."-".$part2."-".$dv);
}


switch($params->method){
	
	
		
	case "createBarCodes": {
		$nums = $ds->query("select * from w_codes where idEmployee = ".$params->employee." order by issueDate ASC limit 1");
		$start = 0;
		
		if($nums->num_rows == 1){
			$row 	= $nums->fetch_object();
			$start 	= $row->stopCode;
		}
		$end = $start+$params->end;
		$result->data = array();
		$result->qry = array();
		for($n = $start; $n<$end; $n++){
			$code 				= createCode($params->employee,$n);
			$qry = "insert into w_codes value(
				NULL,
				'".$code."',
				".$params->employee.",
				'".date("Y-m-d H:i:s")."',
				'".date("Y-m-d H:i:s")."',
				".$start.",
				".$end.",
				0
			)";
			$ds->query($qry);
			$result->data[] 	= $code;
			$result->qry[]		= $qry;
			if(!file_exists($path.$code.".png")){
				QRcode::png($code, $path.$code.".png", 'Q', 3, 2);
			}
		}
		$result->success 	= true;
		$result->error 		= 200;
		$result->errorMsg 	= "";
		break;
	}	
		
		
		
	case "updateCodeStatus" : {
		
		$result->qry = array();
//		$result->qry[] = "select * from w_codes  where code = '".$params->code."'";
		$code = $ds->query("select * from w_codes  where code = '".$params->code."'");
		if($code->num_rows != 0){
			$result->preStatus = $code->status;
			$result->newStatus = $params->status;
			$nums = $ds->query("update w_codes set checkDate = '".date("Y-m-d H:i:s")."' status = ".$params->status." where code = '".$params->code."'");
			$result->success 	= true;
			
//			$result->qry[] = "update w_codes set checkDate = '".date("Y-m-d H:i:s")."' status = ".$params->status." where code = '".$params->code."'";
		}else{
			$result->success 	= false;
			$result->errorMsg 	= "No code found";
		}
		$result->error 		= 200;
		$result->errorMsg 	= "";
		break;
	}			
		
		
		
	case "loginUser":{
		if($params->user == "admin" && $params->psw == ""){
			$result->success 	= true;
			$result->error 		= 200;
			$result->errorMsg 	= "";
		}else{
			$result->success 	= false;
			$result->error 		= 200;
			$result->errorMsg 	= "Invalid Credentials";
		}
		
		break;
	}
	
		
	case "getipoServicioTs":{
		
		$queryResult = $ds->query("select * from w_cat_tipo_servicios");
        if($queryResult->num_rows!=0){
		 	$result->data		= array();
			while($row = $queryResult->fetch_object()){
				$result->data[] = $row;
			}
			$result->success 	= true;
			$result->error 		= 200;
			$result->errorMsg 	= "";
		}else{
			$result->success 	= false;
			$result->error 		= 200;
			$result->errorMsg 	= "Invalid Query";
		}
		break;
	}
		
		
	case "getPositions":{
		
		$queryResult = $ds->query("select * from w_puestos");
        if($queryResult->num_rows!=0){
		 	$result->data		= array();
			while($row = $queryResult->fetch_object()){
				$result->data[] = $row;
			}
			$result->success 	= true;
			$result->error 		= 200;
			$result->errorMsg 	= "";
		}else{
			$result->success 	= false;
			$result->error 		= 200;
			$result->errorMsg 	= "Invalid Query";
		}
		break;
	}
		
	case "getEmployees":{
		
		$queryResult = $ds->query("select * from w_empleados where Observaciones = 'ACTIVO' and idPuesto = ".$params->idPuesto." order by w_empleados.paterno ASC");
        if($queryResult->num_rows!=0){
		 	$result->data		= array();
			while($row = $queryResult->fetch_object()){
				$result->data[] = $row;
			}
			$result->success 	= true;
			$result->error 		= 200;
			$result->errorMsg 	= "";
		}else{
			$result->success 	= false;
			$result->error 		= 200;
			$result->errorMsg 	= "Invalid Query";
		}
		break;
	}
		
	case "getTeams":{
		//$qry =	"select * from w_p_cuadrillas where Fecha like '".date("Y-m-d")."%'";
		
		
		$qry =	"SELECT
				w_p_cuadrillas.*, 
				w_empleados.*
				FROM
				w_p_cuadrillas
				INNER JOIN
				w_empleados
				ON 
				w_p_cuadrillas.idSupervisor = w_empleados.id where Fecha like '".date("Y-m-d")."%'";
		
		
		$queryResult = $ds->query($qry);
		
        if($queryResult->num_rows!=0){
		 	$result->data		= array();
			while($row = $queryResult->fetch_object()){
				switch($row->Turno){
					case 0 : 
						$row->TurnoName = "---";
						break;
					case 1 : 
						$row->TurnoName = "M -";
						break;
					case 2 : 
						$row->TurnoName = "V -";
						break;
					case 3 : 
						$row->TurnoName = "N -";
						break;
				}
				$result->data[] = $row;
			}
			$result->success 	= true;
			$result->error 		= 200;
			$result->errorMsg 	= "";
		}else{
			$result->success 	= false;
			$result->error 		= 200;
			$result->errorMsg 	= "Invalid Query";
		}
		break;
	}	
		
		
	case "getCuadrilla":{
		
		$queryResult 		= $ds->query("select * from w_empleados where Observaciones = 'ACTIVO' and idPuesto = ".$params->idPuesto);
		$queryTeamResult 	= $ds->query("SELECT
											w_p_cuadrillasElementos.*, 
											w_empleados.*
										FROM
											w_p_cuadrillasElementos
											INNER JOIN
											w_empleados
										ON 
											w_p_cuadrillasElementos.idEmpacador = w_empleados.id where w_p_cuadrillasElementos.idCuadrilla = ".$params->idCuadrilla." order by w_empleados.paterno ASC");

		$result->data						= new stdClass();
		$result->data->freeEmployees 		= array();
		$result->data->selectedEmployees 	= array();
		
        if($queryResult->num_rows!=0){
		 	
			while($row = $queryResult->fetch_object()){
				$result->data->freeEmployees[] = $row;
			}
			
			while($row = $queryTeamResult->fetch_object()){
				$result->data->selectedEmployees[] = $row;
			}
			
			$result->success 	= true;
			$result->error 		= 200;
			$result->errorMsg 	= "";
		}else{
			$result->success 	= false;
			$result->error 		= 200;
			$result->errorMsg 	= "Invalid Query";
		}
		break;
	}
		
	case "createCuadrilla":{
		
		$qry = "insert into w_p_cuadrillas values(NULL,".$params->idCoordinator.",'".date("Y-m-d")."','".date("Y-m-d H:i:s")."','".date("Y-m-d H:i:s")."','".$params->comments."',".$params->turno.")";
		$resultId = $ds->query($qry,true);
		
		$result->data 		= new stdClass();
		$result->query		= $qry;
		$result->data->id	= $resultId;
		$result->success 	= true;
		$result->error 		= 200;
		$result->errorMsg 	= "";
		break;
	}
		
		
	case "addEmployee":{
		$qry = "insert into w_p_cuadrillasElementos values(NULL,".$params->idCuadrilla.",".$params->idEmpleado.")";
		$ds->query($qry);
		$result->query		= $qry;
		$result->success 	= true;
		$result->error 		= 200;
		$result->errorMsg 	= "";
		break;
	}
		
	case "deleteEmployeeFromTeam":{
		$ds->query("delete from w_p_cuadrillasElementos where idEmpacador = ".$params->id." and idCuadrilla = ".$params->idCuadrilla);
		$result->success 	= true;
		$result->error 		= 200;
		$result->errorMsg 	= "";
		break;
	}
		
		
		
} 

header('Content-Type: application/json; charset=utf-8');
echo(json_encode($result,JSON_NUMERIC_CHECK));
?>