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
      // Force reset of the Article configuration to restore the 'content' field
      // This deletes the custom layout from the database, forcing Strapi to use the schema default
      await strapi.db.query('strapi::core-store').delete({
        where: {
          key: 'plugin_content_manager_configuration_content_types::api::article.article',
        },
      });
      console.log('✅ Article configuration successfully reset to defaults.');
    } catch (error) {
      console.error('⚠️ Failed to reset Article configuration:', error);
    }
  },
};
