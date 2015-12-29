/* global _ */
var Personas = (function () {
    var strBtn = '<button class="btn btn-mini btn-primary pull-right <%= tipo %>"><%= _.capitalize(tipo) %></button>';
    var strInput = '<input class="<%= clase %>" value="<%= valor %>" type="<%= tipo %>">';
    var strSelect = '<select class="<%= clase %>">' +
                        '<% _.each(col, function(e) { %> ' +
                            '<option value="<%= e.value %>" <%= (e.value === seleccionado) ? "selected" : "" %>>' +
                                '<%= e.label %>' +
                            '</option>' +
                        '<% }); %>' +
                    '</select>';
    var tplBtn = _.template(strBtn);
    var tplInput = _.template(strInput);
    var tplSelect = _.template(strSelect);

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
        var genero = $tr.find('.genero').val();
        var personaForm = {
            nombre: nombre,
            apellido: apellido,
            genero: genero
        };
        return personaForm;
    };

    var getClosest = function (event, sel) {
        var $target = $(event.target);
        var $sel = $target.closest(sel);
        return $sel;
    };

    var getClosest$TR = function (event) {
        return getClosest(event, 'tr');
    };

    var Personas = function (dataSet, slPersonas) {
        var generos = [{
                value: 'M',
                label: 'Masculino'
            }, {
                value: 'F',
                label: 'Femenino'
            }];
        var that = this;
        this.editando = false;
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
                        if (esNuevaPersona(persona) || (that.editando)) {
                            return tplInput({clase: 'nombre', valor: persona.nombre, tipo: 'text'});
                        } else {
                            return persona.nombre;
                        }
                    }
                }, {
                    data: 'apellido',
                    render: function (data, type, persona, meta) {
                        if (esNuevaPersona(persona) || (that.editando)) {
                            return tplInput({clase: 'apellido', valor: persona.apellido, tipo: 'text'});
                        } else {
                            return persona.apellido;
                        }
                    }
                }, {
                    data: 'genero',
                    render: function (data, type, persona, meta) {
                        if (esNuevaPersona(persona) || (that.editando)) {
                            return tplSelect({clase: 'genero', col: generos, seleccionado: persona.genero});
                        } else {
                            var genero = _.find(generos, {value: persona.genero});
                            return genero.label;
                        }
                    }
                }, {
                    className: 'edicion',
                    render: function (data, type, persona, meta) {
                        if (esNuevaPersona(persona) || (that.editando)) {
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
                        dt.row.add({
                            nombre: null,
                            apellido: null,
                            genero: null
                        }).draw();
                        that.editado = true;
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
        var slEditar = '.editar';
        var slEliminar = '.eliminar';
        this.$personas.off(evento, slGuardar).on(evento, slGuardar, function (event) {
            var $tr = getClosest$TR(event);
            var personaForm = getPersonaForm($tr);
            if (esPersonaValida(personaForm)) {
                this.editando = false;
                this.dtPersonas.row($tr).data(personaForm);
                $tr.removeClass('nuevo');
                this.dtPersonas.draw();
            } else {
                alert('Los datos de la persona deben estar completos');
            }
        }.bind(this));
        this.$personas.off(evento, slCancelar).on(evento, slCancelar, function (event) {
            var $tr = getClosest$TR(event);
            this.dtPersonas.row($tr).remove().draw();
            this.editando = false;
        }.bind(this));
        this.$personas.off(evento, slEliminar).on(evento, slEliminar, function (event) {
            var $tr = getClosest$TR(event);
            if (window.confirm("¿Desea eliminar el registro?")) {
                this.dtPersonas.row($tr).remove().draw();
                this.editando = false;
            }
        }.bind(this));
        this.$personas.off(evento, slEditar).on(evento, slEditar, function (event) {
            var $tr = getClosest$TR(event);
            var cells = this.dtPersonas.cells($tr.find('td'));
            this.editando = true;
            cells.invalidate().draw();
        }.bind(this));
    };
    return Personas;
})();
