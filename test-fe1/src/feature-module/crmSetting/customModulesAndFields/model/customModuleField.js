export class CustomModuleField {
  constructor({
    _id = null,
    moduleName = "",
    ofCompany = {
      id: "",
      name: "",
    },
    updatedAt = "",
    createdAt = "",
    updatedBy = "",
    fields = [
      {
        groupFields: [
          {
            column: 1,
            isCustomField: false,
            isRequired: false,
            label: "",
            options: [],
            rolePermission: [
              {
                permission: "",
                role: "",
              },
            ],
            type: "",
            _id: "",
          },
        ],
        groupName: "",
        isCustomGroup: false, // Assuming it should be a boolean
        _id: "",
      },
    ],
  } = {}) {
    this._id = _id;
    this.moduleName = moduleName;
    this.ofCompany = ofCompany;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
    this.updatedBy = updatedBy;
    this.fields = fields;
  }

  // Static method to create an instance from API response
  static fromApiResponse(data) {
    return new CustomModuleField({
      _id: data._id,
      moduleName: data.moduleName,
      ofCompany: data.ofCompany,
      updatedAt: data.updatedAt,
      createdAt: data.createdAt,
      updatedBy: data.updatedBy,
      fields: data.fields || [],
    });
  }
}
