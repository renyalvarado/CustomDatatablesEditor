/* global _ */
var Personas = (function () {
    var noInput = 0;
    var strBtn = '<button class="btn btn-mini btn-primary pull-right <%= tipo %>"><%= _.capitalize(tipo) %></button>';
    var strInput = '<input name="input-<%= noInput %>" class="<%= clase %>" value="<%= valor %>" type="<%= tipo %>" data-rule-required="true">';
    var strSelect = '<select name="select-<%= noInput %>" class="<%= clase %>" data-rule-required="true">' +
                        '<option></option>' +
                        '<% _.each(col, function(e) { %> ' +
                            '<option value="<%= e.value %>" <%= (e.value === seleccionado) ? "selected" : "" %>>' +
                                '<%= e.label %>' +
                            '</option>' +
                        '<% }); %>' +
                    '</select>';
    var tplBtn = _.template(strBtn);
    var tplInput = _.template(strInput);
    var tplSelect = _.template(strSelect);

    var crearInput = function(infoInput) {
        noInput++;
        infoInput.noInput = noInput;
        return tplInput(infoInput);
    };
    
    var crearSelect = function(infoInput) {
        noInput++;
        infoInput.noInput = noInput;
        return tplSelect(infoInput);
    };

    var esNuevaPersona = function (persona) {
        return (_.isUndefined(persona.nombre) || _.isNull(persona.nombre));
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

    var generos = [{
            value: 'M',
            label: 'Masculino'
        }, {
            value: 'F',
            label: 'Femenino'
        }];

    var Personas = function (dataSet, slPersonas) {
        var that = this;
        var txtBtnGuardar = tplBtn({tipo: 'guardar'});
        var txtBtnCancelar = tplBtn({tipo: 'cancelar'});
        var txtBtnEditar = tplBtn({tipo: 'editar'});
        var txtBtnEliminar = tplBtn({tipo: 'eliminar'});
        var txtBotonesNuevo = txtBtnGuardar + txtBtnCancelar;
        var txtBotonesEditar = txtBtnEditar + txtBtnEliminar;
        this.editando = false;
        this.$personas = $(slPersonas);
        this.$formPersonas = this.$personas.closest('form');
        this.$formPersonas.validate();
        this.dtPersonas = this.$personas.DataTable({
            data: dataSet,
            columns: [{
                    data: 'nombre',
                    render: function (data, type, persona, meta) {
                        if (esNuevaPersona(persona) || (that.editando)) {
                            return crearInput({clase: 'nombre', valor: persona.nombre, tipo: 'text'});
                        } else {
                            return persona.nombre;
                        }
                    }
                }, {
                    data: 'apellido',
                    render: function (data, type, persona, meta) {
                        if (esNuevaPersona(persona) || (that.editando)) {
                            return crearInput({clase: 'apellido', valor: persona.apellido, tipo: 'text'});
                        } else {
                            return persona.apellido;
                        }
                    }
                }, {
                    data: 'genero',
                    render: function (data, type, persona, meta) {
                        if (esNuevaPersona(persona) || (that.editando)) {
                            return crearSelect({clase: 'genero', col: generos, seleccionado: persona.genero});
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
                        if (!that.editando) {
                            dt.row.add({
                                nombre: null,
                                apellido: null,
                                genero: null
                            }).draw();
                            that.editando = true;   
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
        var slEditar = '.editar';
        var slEliminar = '.eliminar';
        this.$personas.off(evento, slGuardar).on(evento, slGuardar, function (event) {
            var $tr = getClosest$TR(event);
            var valido = this.$formPersonas.valid();
            if (valido) {
                var personaForm = getPersonaForm($tr);
                this.editando = false;
                this.dtPersonas.row($tr).data(personaForm);
                $tr.removeClass('nuevo');
                this.dtPersonas.draw();
            }
            return false;
        }.bind(this));
        this.$personas.off(evento, slCancelar).on(evento, slCancelar, function (event) {
            var $tr = getClosest$TR(event);
            var row = this.dtPersonas.row($tr);
            var persona = row.data();
            if (esNuevaPersona(persona)) {
                row.remove().draw();
                this.editando = false;
            } else {
                var cells = this.dtPersonas.cells($tr.find('td'));
                this.editando = false;
                cells.invalidate().draw();
            }
            return false;
        }.bind(this));
        this.$personas.off(evento, slEliminar).on(evento, slEliminar, function (event) {
            var $tr = getClosest$TR(event);
            if (window.confirm("¿Desea eliminar el registro?")) {
                this.dtPersonas.row($tr).remove().draw();
            }
            return false;
        }.bind(this));
        this.$personas.off(evento, slEditar).on(evento, slEditar, function (event) {
            if (!this.editando) {
                var $tr = getClosest$TR(event);
                var cells = this.dtPersonas.cells($tr.find('td'));
                this.editando = true;
                cells.invalidate().draw();
            }
            return false;
        }.bind(this));
    };
    return Personas;
})();
