/* global _ */
var Personas = (function () {
    var strBtn = '<button class="btn btn-mini btn-primary pull-right <%= tipo %>"><%= _.capitalize(tipo) %></button>';
    var strInput = '<input class="<%= clase %>" value="<%= valor %>" type="<%= tipo %>">';
    var tplBtn = _.template(strBtn);
    var tplInput = _.template(strInput);

    var esNuevaPersona = function (persona) {
        return (_.isUndefined(persona.nombre) || _.isNull(persona.nombre));
    };

    var esPersonaValida = function (persona) {
        return !(_.isUndefined(persona.nombre) || _.isNull(persona.nombre) || (persona.nombre === ''))
                && !(_.isUndefined(persona.apellido) || _.isNull(persona.apellido) || (persona.apellido === ''));
    };

    var getPersonaForm = function ($tr) {
        var nombre = $tr.find('.nombre').val();
        var apellido = $tr.find('.apellido').val();
        var personaForm = {
            nombre: nombre,
            apellido: apellido
        };
        return personaForm;
    };

    var getClosest$TR = function (event) {
        var $target = $(event.target);
        var $tr = $target.closest('tr');
        return $tr;
    };

    var Personas = function (dataSet, slPersonas) {
        var that = this;
        this.hayNuevo = false;
        var txtBtnGuardar = tplBtn({tipo: 'guardar'});
        var txtBtnCancelar = tplBtn({tipo: 'cancelar'});
        var txtBtnEditar = tplBtn({tipo: 'editar'});
        var txtBtnEliminar = tplBtn({tipo: 'eliminar'});
        var txtBotonesNuevo = txtBtnGuardar + txtBtnCancelar;
        var txtBotonesEditar = txtBtnEditar + txtBtnEliminar;
        this.$personas = $(slPersonas);
        this.dtPersonas = this.$personas.DataTable({
            data: dataSet,
            columns: [{
                    data: 'nombre',
                    render: function (data, type, persona, meta) {
                        if (esNuevaPersona(persona)) {
                            return tplInput({clase: 'nombre', valor: persona.nombre, tipo: 'text'});
                        } else {
                            return persona.nombre;
                        }
                    }
                }, {
                    data: 'apellido',
                    render: function (data, type, persona, meta) {
                        if (esNuevaPersona(persona)) {
                            return tplInput({clase: 'apellido', valor: persona.apellido, tipo: 'text'});
                        } else {
                            return persona.apellido;
                        }
                    }
                }, {
                    className: 'edicion',
                    render: function (data, type, persona, meta) {
                        if (esNuevaPersona(persona)) {
                            return txtBotonesNuevo;
                        } else {
                            return txtBotonesEditar;
                        }
                    }
                }],
            dom: 'Br',
            createdRow: function (row, data, dataIndex) {
                if (esNuevaPersona(data)) {
                    $(row).addClass('nuevo');
                }
            },
            buttons: [{
                    text: 'Nuevo',
                    action: function (e, dt, node, config) {
                        if (that.hayNuevo) {
                            alert('Sólo puede agregar una persona a la vez');
                        } else {
                            dt.row.add({
                                nombre: null,
                                apellido: null
                            }).draw();
                            that.hayNuevo = true;
                        }
                    }
                }

            ]
        });
        this.iniciarEventos();
    };

    Personas.prototype.iniciarEventos = function () {
        var evento = 'click';
        var slGuardar = '.guardar';
        var slCancelar = '.cancelar';
        this.$personas.off(evento, slGuardar).on(evento, slGuardar, function (event) {
            var $tr = getClosest$TR(event);
            $tr.removeClass('nuevo');
            var personaForm = getPersonaForm($tr);
            if (esPersonaValida(personaForm)) {
                this.dtPersonas.row($tr).data(personaForm);
                this.hayNuevo = false;
                this.dtPersonas.draw();
            } else {
                alert('Los datos de la persona deben estar completos');
            }
        }.bind(this));
        this.$personas.off(evento, slCancelar).on(evento, slCancelar, function (event) {
            var $tr = getClosest$TR(event);
            this.dtPersonas.row($tr).remove().draw();
            this.hayNuevo = false;
        }.bind(this));
    };
    return Personas;
})();
