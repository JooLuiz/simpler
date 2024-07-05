import Router from "../main/Router";

describe("Router", () => {
  let router: Router;

  beforeEach(() => {
    router = new Router();
  });

  describe("addRoute", () => {
    it("should add a new route", () => {
      const callback: RouteCallback = (_req, res) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "success" }));
      };

      router.addRoute("/test", ["GET"], callback);

      const route = router.getRoute("/test", "GET");
      expect(route).not.toBeNull();
      expect(route?.url).toBe("/test");
      expect(route?.method).toContain("GET");
      expect(route?.callback).toBe(callback);
    });
  });

  describe("getRoute", () => {
    it("should return the correct route", () => {
      const callback: RouteCallback = (_req, res) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "success" }));
      };

      router.addRoute("/test/:id", ["GET"], callback);

      const route = router.getRoute("/test/1", "GET");
      expect(route).not.toBeNull();
      expect(route?.url).toBe("/test/:id");
      expect(route?.method).toContain("GET");
    });

    it("should return null for non-existing route", () => {
      const route = router.getRoute("/non-existent", "GET");
      expect(route).toBeNull();
    });
  });

  describe("getPathVariables", () => {
    it("should extract path variables correctly", () => {
      const pathVariables = router.getPathVariables("/test/123", "/test/:id");
      expect(pathVariables).toEqual({ id: "123" });
    });
  });

  describe("getQueryParams", () => {
    it("should extract query parameters correctly", () => {
      const queryParams = router.getQueryParams(
        "/test?_fields=_all&_sort=createdIn DESC"
      );
      expect(queryParams).toEqual({ _fields: "_all", _sort: "createdIn DESC" });
    });
  });

  describe("addStaticDirectory", () => {
    it("should add a static directory", () => {
      router.addStaticDirectory("assets");
      const staticDirs = router.getStaticDirs();
      expect(staticDirs).toContain("assets");
    });
  });

  describe("addStaticDirectories", () => {
    it("should add multiple static directories", () => {
      router.addStaticDirectories(["assets", "uploads"]);
      const staticDirs = router.getStaticDirs();
      expect(staticDirs).toContain("assets");
      expect(staticDirs).toContain("uploads");
    });
  });
});
