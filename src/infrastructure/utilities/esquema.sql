table ciudades {
  id_ciudad int [pk, increment]
  lugar varchar(50)
}

table cliente {
  id_cliente int [pk, increment]
  nit varchar
  cliente varchar(50)
  telefono varchar(13)
}

table gasto {
  id_gasto int [pk, increment]
  gasto varchar(100)
}

table manifiesto {
  id_manifiesto int [pk, increment]
  flete_total decimal(15,5)
  anticipo decimal(15,5)
  neto_a_pagar decimal(15,5)
  total_producido decimal(15,5)
  saldo_a_pagar decimal(15,5)
  a_favor_del_carro decimal(15,5)
  queda_al_carro decimal(15,5)
  porcentaje_cond decimal(9,4) // si es un porcentaje, bastan 5,2
}

table perfil {
  id_perfil int [pk, increment]
  perfil varchar(9)
}

table tipodoc {
  id_tipodoc int [pk, increment]
  documento varchar(50)
  abreviatura varchar(15)
}

table usuario {
  id_usuario int [pk, increment]
  fk_tipodoc varchar(2)
  num_doc varchar
  fk_perfil int
  fk_contador int
  p_nombre varchar(20)
  s_nombre varchar(20)
  p_apellido varchar(20)
  s_apellido varchar(20)
  telefono varchar(13)
  correo varchar(300)
  contrasena varchar(50)
}

table viaje {
  id_viaje int [pk, increment]
  fk_usuario int
  fk_manifiesto int
  fk_cliente int
  fk_origen int
  fk_destino int
  observaciones varchar(250)
  estado boolean
  producto varchar(250)
  detalle_prod varchar(250)
  direccion varchar(250)
  f_salida date
  f_llegada date
}

table gastosxviaje {
  id_gastoxviaje int [pk, increment]
  fk_viaje int
  fk_gasto int
  valor decimal(15,5)
  detalles varchar(250)
}

ref: usuario.fk_perfil > perfil.id_perfil
ref: usuario.fk_contador > perfil.id_perfil
ref: usuario.fk_tipodoc > tipodoc.id_tipodoc
ref: viaje.fk_usuario > usuario.id_usuario
ref: viaje.fk_manifiesto > manifiesto.id_manifiesto
ref: viaje.fk_cliente > cliente.id_cliente
ref: viaje.fk_origen > ciudades.id_ciudad
ref: viaje.fk_destino > ciudades.id_ciudad
ref: gastosxviaje.fk_viaje > viaje.id_viaje
ref: gastosxviaje.fk_gasto > gasto.id_gasto

//Flete_Total: Monto a pagar después de los descuentos de ley (Retefuente/ICA).
//Anticipo: Monto del anticipo realizado por el cliente.
//Neto_a_Pagar: Monto total a pagar después del anticipo.
//Total_Producido: Suma del anticipo y el neto a pagar.
//Saldo_a_Pagar: Resta del neto a pagar con el anticipo.
//Queda: Neto - TotalGastos
//A Favor: Anticipo - TotalGastos