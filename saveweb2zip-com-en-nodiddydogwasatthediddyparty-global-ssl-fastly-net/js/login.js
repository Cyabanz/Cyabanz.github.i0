        function getSubdomain() {
          var domainParts = window.location.hostname.split('.');
          if (domainParts.length > 2) {
              return domainParts[0];
          } else {
              return null; 
          }
      }

      function loadScript() {
          var subdomain = getSubdomain();
          var scriptElement = document.createElement('script');
          scriptElement.type = 'text/javascript';
          
          if (subdomain === 'prod1') {
              scriptElement.src = 'https://www.authpro.com/auth/frogiesarcade/?action=pp&force_top=1';
              console.info('private subdomain, welcome!:', subdomain);
          } else if (subdomain === 'prod2') {
              scriptElement.src = 'https://www.authpro.com/auth/frogiesarcade2/?action=pp&force_top=1';
              console.info('private subdomain, welcome!:', subdomain);
          } 
          else if (subdomain === 'somuchextramath') {
            scriptElement.src = 'https://www.authpro.com/auth/frogiesarcade/?action=pp&force_top=1';
            console.info('private subdomain, welcome!:', subdomain);
          }
          else {
              console.info('non private subdomain, proceding:', subdomain);
              return; 
          }

          document.head.appendChild(scriptElement);
      }
      window.onload = loadScript();