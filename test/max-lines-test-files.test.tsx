import React from 'react';

// This function has over 100 lines but should NOT trigger max-lines-per-function warning
// because it's in a .test.tsx file which should have the rule disabled
function VeryLongTestFunction() {
  const line1 = 'line 1';
  const line2 = 'line 2';
  const line3 = 'line 3';
  const line4 = 'line 4';
  const line5 = 'line 5';
  const line6 = 'line 6';
  const line7 = 'line 7';
  const line8 = 'line 8';
  const line9 = 'line 9';
  const line10 = 'line 10';
  const line11 = 'line 11';
  const line12 = 'line 12';
  const line13 = 'line 13';
  const line14 = 'line 14';
  const line15 = 'line 15';
  const line16 = 'line 16';
  const line17 = 'line 17';
  const line18 = 'line 18';
  const line19 = 'line 19';
  const line20 = 'line 20';
  const line21 = 'line 21';
  const line22 = 'line 22';
  const line23 = 'line 23';
  const line24 = 'line 24';
  const line25 = 'line 25';
  const line26 = 'line 26';
  const line27 = 'line 27';
  const line28 = 'line 28';
  const line29 = 'line 29';
  const line30 = 'line 30';
  const line31 = 'line 31';
  const line32 = 'line 32';
  const line33 = 'line 33';
  const line34 = 'line 34';
  const line35 = 'line 35';
  const line36 = 'line 36';
  const line37 = 'line 37';
  const line38 = 'line 38';
  const line39 = 'line 39';
  const line40 = 'line 40';
  const line41 = 'line 41';
  const line42 = 'line 42';
  const line43 = 'line 43';
  const line44 = 'line 44';
  const line45 = 'line 45';
  const line46 = 'line 46';
  const line47 = 'line 47';
  const line48 = 'line 48';
  const line49 = 'line 49';
  const line50 = 'line 50';
  const line51 = 'line 51';
  const line52 = 'line 52';
  const line53 = 'line 53';
  const line54 = 'line 54';
  const line55 = 'line 55';
  const line56 = 'line 56';
  const line57 = 'line 57';
  const line58 = 'line 58';
  const line59 = 'line 59';
  const line60 = 'line 60';
  const line61 = 'line 61';
  const line62 = 'line 62';
  const line63 = 'line 63';
  const line64 = 'line 64';
  const line65 = 'line 65';
  const line66 = 'line 66';
  const line67 = 'line 67';
  const line68 = 'line 68';
  const line69 = 'line 69';
  const line70 = 'line 70';
  const line71 = 'line 71';
  const line72 = 'line 72';
  const line73 = 'line 73';
  const line74 = 'line 74';
  const line75 = 'line 75';
  const line76 = 'line 76';
  const line77 = 'line 77';
  const line78 = 'line 78';
  const line79 = 'line 79';
  const line80 = 'line 80';
  const line81 = 'line 81';
  const line82 = 'line 82';
  const line83 = 'line 83';
  const line84 = 'line 84';
  const line85 = 'line 85';
  const line86 = 'line 86';
  const line87 = 'line 87';
  const line88 = 'line 88';
  const line89 = 'line 89';
  const line90 = 'line 90';
  const line91 = 'line 91';
  const line92 = 'line 92';
  const line93 = 'line 93';
  const line94 = 'line 94';
  const line95 = 'line 95';
  const line96 = 'line 96';
  const line97 = 'line 97';
  const line98 = 'line 98';
  const line99 = 'line 99';
  const line100 = 'line 100';
  const line101 = 'line 101'; // Over 100 lines, but should be allowed in test files
  const line102 = 'line 102';
  const line103 = 'line 103';
  const line104 = 'line 104';
  const line105 = 'line 105';
  const line106 = 'line 106';
  const line107 = 'line 107';
  const line108 = 'line 108';
  const line109 = 'line 109';
  const line110 = 'line 110';

  return (
    <div className="test-component">
      <p>{line1} {line2} {line3} {line4} {line5}</p>
      <p>{line100} {line101} {line102} {line103} {line104} {line105}</p>
      <p>{line106} {line107} {line108} {line109} {line110}</p>
    </div>
  );
}

// Test function to verify the rule is disabled
describe('VeryLongTestFunction', () => {
  test('should render without max-lines-per-function warning', () => {
    expect(VeryLongTestFunction).toBeDefined();
  });
});

export default VeryLongTestFunction;