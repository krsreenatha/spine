describe("Manager", function(){
  var Users;
  var Groups;
  var users;
  var groups;

  beforeEach(function(){
    Users = Spine.Controller.sub();
    Groups = Spine.Controller.sub();

    users = new Users();
    groups = new Groups();
  });

  it("shouldn't overwrite existing methods in Spine.Stack.constructor()", function(){
    var BadStack = Spine.Stack.sub({
      controllers: {
        manager: Users
      }
    });
    expect(function(){
      new BadStack
    }).toThrow();
  });

  it("should toggle active class", function(){
    new Spine.Manager(users, groups);

    groups.active();
    expect(groups.el.hasClass('active')).toBeTruthy();
    expect(users.el.hasClass('active')).not.toBeTruthy();

    users.active();
    expect(groups.el.hasClass('active')).not.toBeTruthy();
    expect(users.el.hasClass('active')).toBeTruthy();
  });

  it("deactivate should work", function(){
    var manager = new Spine.Manager(users, groups);
    users.active();
    manager.deactivate();
    expect(users.el.hasClass('active')).not.toBeTruthy();
  });

  it("should remove controllers on release event", function(){
    var manager = new Spine.Manager(users, groups);

    expect(manager.controllers).toEqual([users, groups]);
    users.release();
    expect(manager.controllers).toEqual([groups]);
  });

  describe("When moving through the stack", function(){
    var spy;

    beforeEach(function(){
      var noop = {spy: function(){}};
      spyOn(noop, "spy");
      spy = noop.spy;
    });

    it("should fire 'active' event on new active controller", function(){
      users.active(spy);
      users.active();
      expect(spy).toHaveBeenCalled();
    });

    it("should fire 'change' event on manager", function(){
      var manager = new Spine.Manager(users, groups);
      manager.bind('change', spy);

      users.active();
      expect(spy).toHaveBeenCalledWith(users);
    });

    it("should call activate on new controller", function(){
      new Spine.Manager(users, groups);
      users.activate = spy;
      users.active(1, 2, 3);
      expect(users.activate).toHaveBeenCalledWith(1, 2, 3);
    });

    it("should call deactivate on previous controller", function(){
      new Spine.Manager(users, groups);
      users.deactivate = spy;
      groups.active(1, 2, 3);
      expect(users.deactivate).toHaveBeenCalledWith(1, 2, 3);
    });
  });
});
