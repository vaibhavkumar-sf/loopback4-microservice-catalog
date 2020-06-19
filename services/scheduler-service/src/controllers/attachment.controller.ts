import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
} from '@loopback/rest';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {Attachment} from '../models';
import {PermissionKey} from '../models/enums/permission-key.enum';
import {AttachmentRepository} from '../repositories';
import {STATUS_CODE, CONTENT_TYPE} from '@sourceloop/core';
import { SchedulerBindings } from '../keys';
import { inject } from '@loopback/core';
import { ISchedulerConfig } from '../types';

const basePath = '/attachments';

export class AttachmentController {
  constructor(
    @repository(AttachmentRepository)
    public attachmentRepository: AttachmentRepository,
    @inject(SchedulerBindings.Config, {
      optional: true,
    })
    private readonly schdulerConfig?: ISchedulerConfig,
  ) {}

  @authorize(['*'])
  @get(`test`, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Attachment model instance',
        content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Attachment)}},
      },
    },
  })
  async test(): Promise<string | undefined> {
    return this.schdulerConfig?.identifierMappedTo;
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.CreateAttachment])
  @post(basePath, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Attachment model instance',
        content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Attachment)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Attachment, {
            title: 'NewAttachment',
            exclude: ['id'],
          }),
        },
      },
    })
    attachment: Omit<Attachment, 'id'>,
  ): Promise<Attachment> {
    return this.attachmentRepository.create(attachment);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.ViewAttachment])
  @get(`${basePath}/count`, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Attachment model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Attachment) where?: Where<Attachment>,
  ): Promise<Count> {
    return this.attachmentRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.ViewAttachment])
  @get(basePath, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Attachment model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Attachment, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Attachment) filter?: Filter<Attachment>,
  ): Promise<Attachment[]> {
    return this.attachmentRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.UpdateAttachment])
  @patch(basePath, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Attachment PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Attachment, {partial: true}),
        },
      },
    })
    attachment: Attachment,
    @param.where(Attachment) where?: Where<Attachment>,
  ): Promise<Count> {
    return this.attachmentRepository.updateAll(attachment, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.ViewAttachment])
  @get(`${basePath}/{id}`, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Attachment model instance',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(Attachment, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Attachment, {exclude: 'where'})
    filter?: FilterExcludingWhere<Attachment>,
  ): Promise<Attachment> {
    return this.attachmentRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.UpdateAttachment])
  @patch(`${basePath}/{id}`, {
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Attachment PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Attachment, {partial: true}),
        },
      },
    })
    attachment: Attachment,
  ): Promise<void> {
    await this.attachmentRepository.updateById(id, attachment);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.UpdateAttachment])
  @put(`${basePath}/{id}`, {
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Attachment PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() attachment: Attachment,
  ): Promise<void> {
    await this.attachmentRepository.replaceById(id, attachment);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.DeleteAttachment])
  @del(`${basePath}/{id}`, {
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Attachment DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.attachmentRepository.deleteById(id);
  }
}
