/* global angular */
Array.prototype.BuscarPorId = function (id) {

  for (var i = 0; i < this.length; i++) {
    if (parseInt(this[i].ID) === parseInt(id)) {
      return angular.copy(this[i]);
    }
  }
  return null;
};

Array.prototype.isValue = function (chave, valor) {
  for (var i = 0; i < this.length; i++) {
    if (this[i][chave] === valor)
      return true;
  }
  return false;
};
Array.prototype.sum = function (chave) {
  var total = 0;
  for (var i = 0; i < this.length; i++) {
    total = total + this[i][chave];
  }
  return total;
};
Array.prototype.find = function (chave, value, comparador) {
  var array=[];

  for (var i = 0; i < this.length; i++) {
    if (this[i][chave] === value) {
      array.push(this[i]);
    }
  }

  return array;
};
Array.prototype.where = function (chave, comparador, value) {

  var array=[];

  for (var i = 0; i < this.length; i++) {

    if (comparador === "=") {
      if (this[i][chave] === value) {
        array.push(this[i]);
      }
    } else if (comparador === ">") {
      if (this[i][chave] > value) {
        array.push(this[i]);
      }
    } else if (comparador === "<") {
      if (this[i][chave] < value) {
        array.push(this[i]);
      }
    } else if (comparador === "!==") {
      if (this[i][chave] !== value) {
        array.push(this[i]);
      }
    } else if (comparador === ">==") {
      if (this[i][chave] >= value) {
        array.push(this[i]);
      }
    } else if (comparador === "<==") {
      if (this[i][chave] <= value) {
        array.push(this[i]);
      }
    }
  }

  return array;
};

//*****String

String.prototype.In = function () {
  var valor = this.toString();
  for (var i = 0; i < arguments.length; i++) {
    if (parseInt(valor) === parseInt(arguments[i])) {
      return true;
    }
  }
  return false;
};

String.prototype.toBoolean = function () {
  var valor = this.toString();
  return valor === '1' || valor === 'true' || valor === 'TRUE';
};

String.prototype.MaxLength = function (v) {
  var valor = this.toString();
  return valor.substring(0, v) + "...";
};

String.prototype.isNullOrEmpty = function () {
  var valor = this.toString();
  if (valor === null || valor === '' || valor === 'null' || valor === undefined) {
    return true;
  }
  return false;
};

String.prototype.toDate = function () {
  var obj = this.toString();

  if (obj) {
   /*jshint evil:true */
    obj = obj.toString().indexOf("/Date(") > -1 ? new Date(eval('new ' + obj.replace("/", "").replace("/", ""))) : obj;
  }
  return obj;
};

String.prototype.isNullOrEmpty = function (args) {
  var valor = '';
  if (args === '' || args === undefined || args === null) {
    valor = this.toString();
  } else {
    valor = args;
  }
  return (valor === null || valor === '' || valor === undefined);
};

//*****Number*******
Number.prototype.In = function () {
  var valor = this.toString();
  for (var i = 0; i < arguments.length; i++) {
    if (parseInt(valor) === parseInt(arguments[i])) {
      return true;
    }
  }
  return false;
};

Number.prototype.isNullOrEmpty = function () {
  var valor = this.toString();
  return (valor === null || valor === '' || valor === undefined || isNaN(valor));
};

Number.prototype.trunc = function (qtdCasasDecimais) {
  return this.toFixed(qtdCasasDecimais);
};

Number.prototype.subtrair = function (value) {
  if (!value)
    return this;
  if (value.isNullOrEmpty())
    return 0;
  var valor1 = parseFloat(this).toFixed(2);
  var valor2 = parseFloat(value).toFixed(2);
  var resultado = (valor1 - valor2);
  return resultado;
};

Number.prototype.subtrairPorcentagem = function (value) {
  if (!value)
    return this;
  if (value.isNullOrEmpty())
    return 0;
  var valor1 = parseFloat(this).toFixed(2);
  var procentagem = valor1 - (valor1 * value);
  return procentagem;
};

Number.prototype.obterValorDaPorcentagem = function (value) {
  if (!value)
    return 0;
  if (value.isNullOrEmpty())
    return 0;
  var valor1 = parseFloat(this).toFixed(2);
  var procentagem = valor1 * value;
  return procentagem;
};
//*****Window

Window.prototype.isNullOrEmpty = function () {
  var valor = this.toString();
  if (valor === null || valor === '' || valor === 'null' || valor === undefined) {
    return true;
  }
  return false;
};

//$scope.chat.atualizarAlert.In("id") = parseInt($scope.user.amigo)!==destinatario;             
//  unshift - >adiciona no começo pop remove do fim...
// ARRAY.forEach(function(element){});
// ARRAY.filter
// ARRAY.every -> todos são
// ARRAY.some -> existe
// ARRAY.map
// ARRAY.reduce(valor_Anterior, atual) -> somar





