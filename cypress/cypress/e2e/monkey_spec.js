describe("Monkey Testing con Cypress en GHOST", () => {
  // Función para iniciar sesión
  const login = () => {
      cy.visit("http://localhost:2368/ghost/#/signin"); // URL de GHOST
      cy.get('input[type="email"]').type('df.zapata@uniandes.edu.co'); // Correo
      cy.get('input[type="password"]').type('Liliana.2357'); // Contraseña
      cy.get('button[type="submit"]').click(); // Botón de inicio de sesión
      cy.wait(3000); // Esperar a que se cargue la página después del inicio de sesión
  };

  // Función de clic aleatorio en elementos visibles
  const randomClick = () => {
      cy.get('body').then(($body) => {
          const elements = $body.find('a:visible, button:visible, .gh-tag-list-item:visible');
          if (elements.length > 0) {
              const randomElement = elements[Math.floor(Math.random() * elements.length)];
              cy.wrap(randomElement).click({ force: true });
          } else {
              console.log('No hay elementos visibles clickeables.');
          }
      });
  };

  // Función de escritura aleatoria en campos de texto visibles
  const randomType = () => {
    // Espera a que haya al menos un input o textarea visible con un tiempo de espera mayor
    cy.get('input:visible, textarea:visible', { timeout: 100000 }).then(($fields) => {
      if ($fields.length > 0) {
        const field = $fields[Math.floor(Math.random() * $fields.length)];
        cy.wrap(field).type("Texto aleatorio", { force: true });
      } else {
        console.log("No hay campos de entrada visibles disponibles para escribir.");
      }
    });
  };
  

// Función de scroll aleatorio en la página
const randomScroll = () => {
  cy.get('body').scrollTo("bottom", { ensureScrollable: false });
  cy.wait(5000);
  cy.get('body').scrollTo("top", { ensureScrollable: false });
};


  // Pruebas específicas para Posts
  const testPosts = () => {
    cy.visit("http://localhost:2368/ghost/#/posts"); // Navegar a la sección de Posts
    cy.wait(30000);
    
    cy.get('.gh-posts-list-item').then(($posts) => {
        if ($posts.length > 0) {
            const randomPost = $posts[Math.floor(Math.random() * $posts.length)];
            cy.wrap(randomPost).click({ force: true }); // Clic en un post aleatorio para abrirlo
            
            cy.wait(20000); // Esperar a que la página del editor cargue
            
            const postAction = Math.floor(Math.random() * 3);
            if (postAction === 0) {
                // Publicar post
                cy.get('.gh-publishmenu-trigger').click({ force: true }); // Abrir el menú de publicación
                cy.get('.gh-publishmenu-radio-label').contains(/Publish|Update/, { timeout: 10000 }).click({ force: true });
                cy.get('.gh-publishmenu-button').click({ force: true });
                cy.wait(10000);
            } else if (postAction === 1) {
                // Editar post
                cy.get('.koenig-editor__editor', { timeout: 100000 }) // Esperar a que el editor esté disponible
                  .should('be.visible')
                  .type(" Actualización automática", { force: true });
                cy.get('button').contains('Update').click({ force: true });
            } else {
                // Eliminar post
                cy.get('button[title="Settings"]').click({ force: true }); // Abrir configuración del post
                cy.wait(5000);
                cy.get('button').contains('Delete post').click({ force: true });
                cy.get('.modal-footer button').contains('Delete').click({ force: true });
                cy.wait(10000);
            }
        } else {
            // Si no hay posts, crear uno nuevo
            cy.get('a[href="#/editor/post/"]').click({ force: true });
            cy.get('.koenig-editor__editor', { timeout: 100000 }) // Esperar a que el editor esté disponible
              .type("Nuevo Post", { force: true });
            cy.get('.gh-publishmenu-trigger').click({ force: true }); // Abrir el menú de publicación
            cy.get('.gh-publishmenu-radio-label').contains('Publish').click({ force: true });
            cy.get('.gh-publishmenu-button').click({ force: true });
        }
    });
};





  // Pruebas específicas para Pages
  const testPages = () => {
      cy.visit("http://localhost:2368/ghost/#/pages"); // Navegar a la sección de Pages
      cy.wait(3000);

      cy.get('.gh-list-row').then(($pages) => {
          if ($pages.length > 0) {
              const randomPage = $pages[Math.floor(Math.random() * $pages.length)];
              cy.wrap(randomPage).click({ force: true });

              const pageAction = Math.floor(Math.random() * 3);
              if (pageAction === 0) {
                  // Publicar page
                  cy.get('button').contains('Publish').click({ force: true });
                  cy.get('.gh-publishmenu-button').click({ force: true });
              } else if (pageAction === 1) {
                  // Editar page
                  cy.get('.koenig-editor__editor').type(" Actualización automática", { force: true });
                  cy.get('button').contains('Update').click({ force: true });
              } else {
                  // Eliminar page
                  cy.get('button.post-settings').click({ force: true });
                  cy.get('button').contains('Delete page').click({ force: true });
                  cy.get('.modal-footer button').contains('Delete').click({ force: true });
              }
          } else {
              cy.get('a[href="#/editor/page/"]').click({ force: true });
          }
      });
  };

  // Pruebas específicas para Tags
  const testTags = () => {
    cy.visit("http://localhost:2368/ghost/#/tags"); // Navegar a la sección de Tags
    cy.wait(30000);

    // Verificar si existen tags y seleccionar uno aleatorio, o crear un nuevo tag si no existen
    cy.get('.gh-main').then(($mainContent) => {
        if ($mainContent.find('.gh-tag-list-item').length > 0) {
            cy.get('.gh-tag-list-item', { timeout: 100000 }).then(($tags) => {
                const randomTag = $tags[Math.floor(Math.random() * $tags.length)];
                cy.wrap(randomTag).click({ force: true });

                const tagAction = Math.floor(Math.random() * 2);
                if (tagAction === 0) {
                    // Editar tag
                    cy.get('input[name="name"]').clear().type("Tag Actualizado", { force: true });
                    cy.get('button').contains('Save').click({ force: true });
                } else {
                    // Eliminar tag
                    cy.get('button').contains('Delete tag').click({ force: true });
                    cy.get('.modal-footer button').contains('Delete').click({ force: true });
                }
            });
        } else {
            // Si no hay tags, crear uno nuevo
            cy.get('a[href="#/tags/new/"]').click({ force: true });
            cy.get('input[name="name"]').type("Nuevo Tag", { force: true });
            cy.get('button').contains('Save').click({ force: true });
        }
    });
};


  // Iniciar sesión antes de todas las pruebas
  before(() => {
      login();
  });

  // Manejo de excepciones no controladas
  Cypress.on('uncaught:exception', (err, runnable) => {
      console.log('Excepción no controlada:', err);
      return false; // Para que Cypress ignore este error
  });

  // Prueba principal con acciones aleatorias
  it("Realizar acciones aleatorias en el panel de GHOST", () => {
      for (let i = 0; i < 50; i++) { // Número de interacciones
          const action = Math.floor(Math.random() * 6); // Aumentar a 6 para incluir todas las acciones

          switch (action) {
              case 0:
                  randomClick();
                  break;
              case 1:
                  randomType();
                  break;
              case 2:
                  randomScroll();
                  break;
              case 3:
                  testTags(); // Realizar pruebas en Tags
                  break;
              case 4:
                  testPosts(); // Realizar pruebas en Posts
                  break;
              case 5:
                  testPages(); // Realizar pruebas en Pages
                  break;
          }

          cy.wait(50000); // Pausa entre interacciones
      }
  });
});