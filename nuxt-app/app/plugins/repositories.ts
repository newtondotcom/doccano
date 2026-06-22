import { APIAssignmentRepository } from '@/repositories/example/apiAssignmentRepository'
import { APIAuthRepository } from '@/repositories/auth/apiAuthRepository'
import { APIConfigRepository } from '@/repositories/autoLabeling/config/apiConfigRepository'
import { APITemplateRepository } from '@/repositories/autoLabeling/template/apiTemplateRepository'
import { APITaskStatusRepository } from '@/repositories/celery/apiTaskStatusRepository'
import { APICommentRepository } from '@/repositories/comment/apiCommentRepository'
import { APIDownloadFormatRepository } from '@/repositories/download/apiDownloadFormatRepository'
import { APIDownloadRepository } from '@/repositories/download/apiDownloadRepository'
import { APIExampleRepository } from '@/repositories/example/apiDocumentRepository'
import { APILabelRepository } from '@/repositories/label/apiLabelRepository'
import { APIMemberRepository } from '@/repositories/member/apiMemberRepository'
import { APIMetricsRepository } from '@/repositories/metrics/apiMetricsRepository'
import { LocalStorageOptionRepository } from '@/repositories/option/apiOptionRepository'
import { APIProjectRepository } from '@/repositories/project/apiProjectRepository'
import { APIRoleRepository } from '@/repositories/role/apiRoleRepository'
import { APITagRepository } from '@/repositories/tag/apiTagRepository'
import { APIBoundingBoxRepository } from '@/repositories/tasks/apiBoundingBoxRepository'
import { APICategoryRepository } from '@/repositories/tasks/apiCategoryRepository'
import { APIRelationRepository } from '@/repositories/tasks/apiRelationRepository'
import { APISpanRepository } from '@/repositories/tasks/apiSpanRepository'
import { APITextLabelRepository } from '@/repositories/tasks/apiTextLabelRepository'
import { APICatalogRepository } from '@/repositories/upload/apiCatalogRepository'
import { APIParseRepository } from '@/repositories/upload/apiParseRepository'
import { APIUserRepository } from '@/repositories/user/apiUserRepository'
import { APISegmentationRepository } from '@/repositories/tasks/apiSegmentationRepository'

export interface Repositories {
  auth: APIAuthRepository
  user: APIUserRepository
  project: APIProjectRepository
  member: APIMemberRepository
  role: APIRoleRepository
  tag: APITagRepository
  example: APIExampleRepository
  comment: APICommentRepository
  taskStatus: APITaskStatusRepository
  metrics: APIMetricsRepository
  option: LocalStorageOptionRepository
  assignment: APIAssignmentRepository
  config: APIConfigRepository
  template: APITemplateRepository
  catalog: APICatalogRepository
  parse: APIParseRepository
  downloadFormat: APIDownloadFormatRepository
  download: APIDownloadRepository
  categoryType: APILabelRepository
  spanType: APILabelRepository
  relationType: APILabelRepository
  category: APICategoryRepository
  span: APISpanRepository
  relation: APIRelationRepository
  textLabel: APITextLabelRepository
  boundingBox: APIBoundingBoxRepository
  segmentation: APISegmentationRepository
}

export const repositories: Repositories = {
  auth: new APIAuthRepository(),
  user: new APIUserRepository(),
  project: new APIProjectRepository(),
  member: new APIMemberRepository(),
  role: new APIRoleRepository(),
  tag: new APITagRepository(),
  example: new APIExampleRepository(),
  comment: new APICommentRepository(),
  taskStatus: new APITaskStatusRepository(),
  metrics: new APIMetricsRepository(),
  option: new LocalStorageOptionRepository(),
  assignment: new APIAssignmentRepository(),
  config: new APIConfigRepository(),
  template: new APITemplateRepository(),
  catalog: new APICatalogRepository(),
  parse: new APIParseRepository(),
  downloadFormat: new APIDownloadFormatRepository(),
  download: new APIDownloadRepository(),
  categoryType: new APILabelRepository('category-type'),
  spanType: new APILabelRepository('span-type'),
  relationType: new APILabelRepository('relation-type'),
  category: new APICategoryRepository(),
  span: new APISpanRepository(),
  relation: new APIRelationRepository(),
  textLabel: new APITextLabelRepository(),
  boundingBox: new APIBoundingBoxRepository(),
  segmentation: new APISegmentationRepository()
}

export default defineNuxtPlugin({
  name: 'doccano-repositories',
  setup() {
    return {
      provide: {
        repositories
      }
    }
  }
})
