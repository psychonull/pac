
describe('PAC', function(){
  
  it("should be exposed in window.pac", function(){
    expect(window.pac).to.be.an("object");
  });

  describe("Game", function(){

    it("should exists Base Class", function(){
      expect(window.pac.Base).to.be.a("function");
    });

  });

});
