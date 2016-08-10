

export default class Renderer {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this.templates = {};
  }
  render(def, data, templateName) {
    return new Promise((resolve, reject) => {
      let dataWithDefaults = def.props.reduce((prev, cur) => {
        prev[cur.name] = data[cur.name] || cur.default;
        return prev;
      }, {});
      if(this.templates[templateName]) {
        this.doRender(dataWithDefaults, this.templates[templateName], resolve, reject);
      }
      else {
        var oReq = new XMLHttpRequest();
        oReq.open("GET", `${ this.rootPath }/${ templateName }.ejs`);
        oReq.send();
        oReq.addEventListener("error", (e) => {
          reject(e);
        });
        oReq.addEventListener("load", () => {
          this.templates[templateName] = oReq.responseText;
          this.doRender(dataWithDefaults, this.templates[templateName], resolve, reject);
        });
      }
    });
  }
  doRender(data, template, resolve, reject) {
    try {
      resolve(ejs.render(template, data));
    }
    catch(e) {
      console.error('could not render the template', e, data, template);
      reject(e);
    }
  }
}