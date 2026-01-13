// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: any }) {
    try {
      const validConfig = JSON.stringify({
        uid: "api::article.article",
        settings: {
          bulkable: true,
          filterable: true,
          searchable: true,
          pageSize: 10,
          mainField: "title",
          defaultSortBy: "title",
          defaultSortOrder: "ASC"
        },
        metadatas: {
          id: { edit: {}, list: { label: "id", searchable: true, sortable: true } },
          documentId: { edit: {}, list: { label: "documentId", searchable: true, sortable: true } },
          title: { edit: {}, list: { label: "title", searchable: true, sortable: true } },
          slug: { edit: {}, list: { label: "slug", searchable: true, sortable: true } },
          createdAt: { edit: {}, list: { label: "createdAt", searchable: true, sortable: true } },
          updatedAt: { edit: {}, list: { label: "updatedAt", searchable: true, sortable: true } },
          publishedAt: { edit: {}, list: { label: "publishedAt", searchable: true, sortable: true } },
          createdBy: { edit: {}, list: { label: "createdBy", searchable: true, sortable: true } },
          updatedBy: { edit: {}, list: { label: "updatedBy", searchable: true, sortable: true } },
          locale: { edit: {}, list: { label: "locale", searchable: true, sortable: true } },
          content: { edit: { label: "content", description: "", placeholder: "", visible: true, editable: true }, list: {} },
          excerpt: { edit: { label: "excerpt", description: "", placeholder: "", visible: true, editable: true }, list: {} },
          coverImage: { edit: { label: "coverImage", description: "", placeholder: "", visible: true, editable: true }, list: {} },
          category: { edit: { label: "category", description: "", placeholder: "", visible: true, editable: true }, list: {} },
          author: { edit: { label: "author", description: "", placeholder: "", visible: true, editable: true }, list: {} },
          aiTldr: { edit: { label: "aiTldr", description: "", placeholder: "", visible: true, editable: true }, list: {} },
          aiMetaDescription: { edit: { label: "aiMetaDescription", description: "", placeholder: "", visible: true, editable: true }, list: {} },
          aiKeywords: { edit: { label: "aiKeywords", description: "", placeholder: "", visible: true, editable: true }, list: {} }
        },
        layouts: {
          list: ["id", "title", "slug", "publishedAt", "createdAt"],
          edit: [
            [{ name: "title", size: 6 }, { name: "slug", size: 6 }],
            [{ name: "content", size: 12 }],
            [{ name: "excerpt", size: 12 }],
            [{ name: "category", size: 6 }, { name: "author", size: 6 }],
            [{ name: "coverImage", size: 12 }],
            [{ name: "aiTldr", size: 12 }],
            [{ name: "aiMetaDescription", size: 12 }],
            [{ name: "aiKeywords", size: 12 }]
          ]
        }
      });

      const key = 'plugin_content_manager_configuration_content_types::api::article.article';

      // update or create
      const existing = await strapi.db.query('strapi::core-store').findOne({ where: { key } });

      if (existing) {
        await strapi.db.query('strapi::core-store').update({
          where: { key },
          data: { value: validConfig }
        });
        console.log('✅ REPAIRED existing Article configuration.');
      } else {
        await strapi.db.query('strapi::core-store').create({
          data: { key, value: validConfig, type: 'object', environment: null, tag: null }
        });
        console.log('✅ CREATED missing Article configuration.');
      }

    } catch (e) {
      console.error('⚠️ Failed to repair Article configuration:', e);
    }
  },
};
