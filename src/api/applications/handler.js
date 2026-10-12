class ApplicationsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postApplicationHandler(req, res, next) {
    try {
      this._validator.validatePostApplicationPayload(req.body);

      const userId = req.body.user_id || req.user.id;
      const { job_id: jobId, status } = req.body;

      const applicationId = await this._service.addApplication({
        userId,
        jobId,
        status: status || 'pending',
      });

      return res.status(201).json({
        status: 'success',
        data: {
          id: applicationId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getApplicationsHandler(req, res, next) {
    try {
      const applications = await this._service.getApplications();

      return res.status(200).json({
        status: 'success',
        data: {
          applications,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getApplicationsByUserIdHandler(req, res, next) {
    try {
      const { userId } = req.params;
      const applications = await this._service.getApplicationsByUserId(userId);

      return res.status(200).json({
        status: 'success',
        data: {
          applications,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getApplicationsByJobIdHandler(req, res, next) {
    try {
      const { jobId } = req.params;
      const applications = await this._service.getApplicationsByJobId(jobId);

      return res.status(200).json({
        status: 'success',
        data: {
          applications,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getApplicationByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      const application = await this._service.getApplicationById(id);

      return res.status(200).json({
        status: 'success',
        data: application,
      });
    } catch (error) {
      next(error);
    }
  }

  async putApplicationStatusByIdHandler(req, res, next) {
    try {
      this._validator.validatePutApplicationStatusPayload(req.body);

      const { id } = req.params;
      const { status } = req.body;

      await this._service.editApplicationStatusById(id, status);

      return res.status(200).json({
        status: 'success',
        message: 'Status lamaran berhasil diperbarui',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteApplicationByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      await this._service.deleteApplicationById(id);

      return res.status(200).json({
        status: 'success',
        message: 'Lamaran berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ApplicationsHandler;
