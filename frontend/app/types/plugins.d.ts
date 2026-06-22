import type { Repositories } from "@/plugins/repositories";
import type { Services } from "@/plugins/services";
import type { RoleMapping } from "@/plugins/utils";

declare module "#app" {
  interface NuxtApp {
    $repositories: Repositories;
    $services: Services;
    $contrastColor: (hexString: string) => string;
    $translateRole: (role: string, mappings: RoleMapping) => string;
    $truncate: (text: string, length?: number, clamp?: string) => string;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $repositories: Repositories;
    $services: Services;
    $contrastColor: (hexString: string) => string;
    $translateRole: (role: string, mappings: RoleMapping) => string;
    $truncate: (text: string, length?: number, clamp?: string) => string;
  }
}

export {};
