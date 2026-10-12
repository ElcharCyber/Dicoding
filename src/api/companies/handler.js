class CompaniesHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postCompanyHandler(req, res, next) {
    try {
      this._validator.validateCompanyPayload(req.body);
      const companyId = await this._service.addCompany(req.body);

      return res.status(201).json({
        status: 'success',
        data: {
          id: companyId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getCompaniesHandler(req, res, next) {
    try {
      const companies = await this._service.getCompanies();

      return res.status(200).json({
        status: 'success',
        data: {
          companies,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getCompanyByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      const company = await this._service.getCompanyById(id);

      return res.status(200).json({
        status: 'success',
        data: company,
      });
    } catch (error) {
      next(error);
    }
  }

  async putCompanyByIdHandler(req, res, next) {
    try {
      this._validator.validateCompanyPayload(req.body);
      const { id } = req.params;
      await this._service.editCompanyById(id, req.body);

      return res.status(200).json({
        status: 'success',
        message: 'Company berhasil diperbarui',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCompanyByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      await this._service.deleteCompanyById(id);

      return res.status(200).json({
        status: 'success',
        message: 'Company berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CompaniesHandler;
