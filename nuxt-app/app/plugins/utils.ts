export type RoleMapping = {
  projectAdmin: string
  annotator: string
  annotationApprover: string
  undefined: string
}

export function contrastColor(hexString: string): string {
  const r = parseInt(hexString.slice(1, 3), 16)
  const g = parseInt(hexString.slice(3, 5), 16)
  const b = parseInt(hexString.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 < 128 ? '#ffffff' : '#000000'
}

export function translateRole(role: string, mappings: RoleMapping): string {
  if (role === 'project_admin') {
    return mappings.projectAdmin
  }
  if (role === 'annotator') {
    return mappings.annotator
  }
  if (role === 'annotation_approver') {
    return mappings.annotationApprover
  }
  return mappings.undefined
}

export function translatedRoles<T extends { name: string; translatedName?: string }>(
  roles: T[],
  mappings: RoleMapping
): T[] {
  roles.forEach((role) => {
    role.translatedName = translateRole(role.name, mappings)
  })
  return roles
}

export default defineNuxtPlugin({
  name: 'doccano-utils',
  setup(nuxtApp) {
    nuxtApp.vueApp.config.globalProperties.$contrastColor = contrastColor
    nuxtApp.vueApp.config.globalProperties.$translateRole = translateRole

    return {
      provide: {
        contrastColor,
        translateRole,
        translatedRoles
      }
    }
  }
})
