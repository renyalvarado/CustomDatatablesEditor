/* global _ */

var Personas = function () {
    console.log('Constructor de iniciar');
    var dataSet = [{
            nombre: 'Reny',
            apellido: 'Alvarado'
        }, {
            nombre: 'Omar',
            apellido: 'Riera'
        }];
    var strBtn = '<button class="btn btn-mini btn-primary pull-right <%= tipo %>"><%= _.capitalize(tipo) %></button>';
    var tplBtn = _.template(strBtn);
    var txtBtnGuardar = tplBtn({tipo: 'guardar'});
    var txtBtnCancelar = tplBtn({tipo: 'cancelar'});
    var txtBtnEditar = tplBtn({tipo: 'editar'});
    var txtBtnEliminar = tplBtn({tipo: 'eliminar'});
    var txtBotonesNuevo = txtBtnGuardar + txtBtnCancelar;
    var txtBotonesEditar = txtBtnEditar + txtBtnEliminar;
    this.slPersonas = '#personas';
    console.log();
    this.$personas = $(this.slPersonas);
    console.table(dataSet);
    this.dtPersonas = this.$personas.DataTable({
        data: dataSet,
        columns: [{
                data: 'nombre'
            }, {
                data: 'apellido'
            }, {
                className: 'edicion',
                render: function (data, type, persona, meta) {
                    console.log('data: ', data);
                    console.log('type: ', type);
                    console.log('persona: ', persona);
                    console.log('meta: ', meta);
                    if (_.isUndefined(persona.nombre) || _.isNull(persona.nombre)) {
                        return txtBotonesNuevo;
                    } else {
                        return txtBotonesEditar;
                    }
                }
            }],
        dom: 'Br',
        buttons: [{
                text: 'Nuevo',
                action: function (e, dt, node, config) {
                    dt.row.add({
                        nombre: null,
                        apellido: null
                    }).draw();
                    console.log('e', e);
                    console.log('dt', dt);
                    console.log('node', node);
                    console.log('config', config);
                }
            }

        ]
    });

};

Personas.prototype.iniciar = function () {
    console.log('Persona.iniciar');
    var evento = 'click';
    var slGuardar = '.guardar';
    var slCancelar = '.cancelar';
    this.$personas.off(evento, slGuardar).on(evento, slGuardar, function (event) {
        var $target = $(event.target);
        var $tr = $target.closest('tr');
        var data = this.dtPersonas.row($tr).data();
        console.log('Guardar');
        console.log('$tr: ', $tr);
        console.log('data: ', data);
    }.bind(this));
    this.$personas.off(evento, slCancelar).on(evento, slCancelar, function (event) {
        console.log('Cancelar');
    });
};
