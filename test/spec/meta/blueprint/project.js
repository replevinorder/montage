/* <copyright>
s</copyright> */
var Montage = require("montage").Montage;

var BinderHelper = require("spec/meta/blueprint/binderhelper").BinderHelper;
var binder = BinderHelper.companyBinder();
var blueprint = binder.objectDescriptorForName("Project");

var Project = exports.Project = blueprint.create(Montage, {

    // Token class

});
