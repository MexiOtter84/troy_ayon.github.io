package com.zodiac.app;
import java.awt.BorderLayout;
import java.awt.CardLayout;
import java.awt.EventQueue;
import java.awt.FlowLayout;
import java.awt.HeadlessException;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.BorderFactory;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;

/* The following import was added as an additional feature for the random button */
import java.util.Random;

public class SlideShow extends JFrame {
	
	private static final long serialVersionUID = 1L;
	//Declaration Variables
	private JPanel slidePane;
	private JPanel textPane;
	private JPanel buttonPane;
	private JPanel southPanel;
	private CardLayout card;
	private CardLayout cardText;
	private JButton btnPrev;
	private JButton btnNext;
	private JLabel lblSlide;
	private JLabel lblTextArea;
	//Following is used for random button functionality added for improved functionality
	private JButton randomButton;
	int min = 1;
	int max = 12;
	
	//Creation of the application
	public SlideShow() throws HeadlessException {
		initComponent();
	}
	
	//Initialization of the contents of the frame
	private void initComponent() {
		//Sets variables to empty objects
		card = new CardLayout();
		cardText = new CardLayout();
		slidePane = new JPanel();
		textPane = new JPanel();
		
		//Sets the x, y, height and width of the text area 
		textPane.setBounds(200, 447, 400, 70);
		textPane.setVisible(true);
		
		//Initialization of slide buttons
		buttonPane = new JPanel();
		btnPrev = new JButton();
		btnNext = new JButton();
		randomButton = new JButton();
		
		//Initialization of slide labels
		lblSlide = new JLabel();
		lblTextArea = new JLabel();
		
		//Styling information for the elements within the program
		lblSlide.setForeground(new java.awt.Color(249, 241, 240));
		slidePane.setBackground(new java.awt.Color(35, 43, 27));
		textPane.setBackground(new java.awt.Color(103, 65, 38));
		
		//Styling for buttons
		buttonPane.setBackground(new java.awt.Color(164, 92, 64));
		
		//Styling for previous button
		btnPrev.setBackground(new java.awt.Color(246, 238, 224));
		btnPrev.setForeground(Color.BLACK);
		btnPrev.setBorder(BorderFactory.createCompoundBorder(BorderFactory.createLineBorder(new java.awt.Color(35, 43, 27),1),
				BorderFactory.createLineBorder(new java.awt.Color(246, 238, 224), 4)));
		btnPrev.setFont(new Font("Arial", Font.BOLD, 16));

		//Sets the size of the previous button
		btnPrev.setPreferredSize(new Dimension(120, 40));
		
		//Styling information for the next button
		btnNext.setBackground(new java.awt.Color(246, 238, 224));
		btnNext.setForeground(Color.BLACK);
		btnNext.setBorder(BorderFactory.createCompoundBorder(BorderFactory.createLineBorder(new java.awt.Color(35, 43, 27),1),
				BorderFactory.createLineBorder(new java.awt.Color(246, 238, 224), 4)));
		btnNext.setFont(new Font("Arial", Font.BOLD, 16));

		//Sets the size of the next button
		btnNext.setPreferredSize(new Dimension(120, 40));
		
		//Styling for the random button
		randomButton.setBackground(new java.awt.Color(246, 238, 224));
		randomButton.setForeground(Color.BLACK);
		randomButton.setBorder(BorderFactory.createCompoundBorder(BorderFactory.createLineBorder(new java.awt.Color(35, 43, 27),1),
				BorderFactory.createLineBorder(new java.awt.Color(246, 238, 224), 4)));
		randomButton.setFont(new Font("Arial", Font.BOLD, 16));

		//Sets the size of the random button
		randomButton.setPreferredSize(new Dimension(120, 40));
		
		//Setup for frame attributes
		setSize(1200, 1000);
		
		//Sets the program so it cannot be resized
		setResizable(false);
		setLocationRelativeTo(null);
		
		//Sets title of the program
		setTitle("Zodiac Sign Informational Slide Show!");
		
		//Sets the layouts with a border
		getContentPane().setLayout(new BorderLayout(15, 80));
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		
		//Sets the layouts of the panels
		slidePane.setLayout(card);
		textPane.setLayout(cardText);
		
		//Information logic to add each of the slides and text to screen
		for (int i = 1; i <= 12; i++) {
			lblSlide = new JLabel();
			lblTextArea = new JLabel();
			lblSlide.setText(getResizeIcon(i));
			lblTextArea.setText(getTextDescription(i));
			slidePane.add(lblSlide, "card" +i);
			textPane.add(lblTextArea, "cardText" + i);
		}
		
		getContentPane().add(slidePane, BorderLayout.CENTER);

		//Create a container panel for the south region to hold both text and buttons
		southPanel = new JPanel();
		southPanel.setLayout(new BorderLayout());
		southPanel.setBackground(new java.awt.Color(164, 92, 64));
		southPanel.add(textPane, BorderLayout.CENTER);

		buttonPane.setLayout(new FlowLayout(FlowLayout.CENTER, 20, 10));
		
		//Places the previous button on the slide show page
		btnPrev.setText("Previous");
		btnPrev.addActionListener(new ActionListener() {
			
			@Override
			public void actionPerformed(ActionEvent e) {
				goPrevious();
			}
		});
		buttonPane.add(btnPrev);
		
		//Places the random button on the slide show page
		randomButton.setText("Random");
		randomButton.addActionListener(new ActionListener() {

			@Override
			public void actionPerformed(ActionEvent e) {
				goRandom();
			}
		});
		buttonPane.add(randomButton);

		//Places the next button on the slide show page
		btnNext.setText("Next");
		btnNext.addActionListener(new ActionListener() {
			
			@Override
			public void actionPerformed(ActionEvent e) {
				goNext();
			}
		});
		buttonPane.add(btnNext);

		//Add button panel to south panel and add south panel to frame
		southPanel.add(buttonPane, BorderLayout.SOUTH);
		getContentPane().add(southPanel, BorderLayout.SOUTH);
	}
		
	//Previous button functionality
	private void goPrevious() {
		card.previous(slidePane);
		cardText.previous(textPane);
	}
	
	//Method that is used to obtain a random slide of a zodiac sign
	private void goRandom() {
		//To obtain a random slide a random number needs to be generated
		int random_int = (int)Math.floor(Math.random()*(max-min+1)+min);
		//Navigate directly to the randomly selected slide
		card.show(slidePane, "card" + random_int);
		cardText.show(textPane, "cardText" + random_int);
	}
	
	//Next button functionality
	private void goNext() {
		card.next(slidePane);
		cardText.next(textPane);
	}
	
	//Method to get the images that are utilized in the slide show
	private String getResizeIcon(int i) {
		String image = "";
		String imageFilePath = "";
		
		//Implementation of the DRY concept by making the image file paths their own variable and using string concatenation to combine the file path and the slide HTML information.
		if (i==1) {
			imageFilePath = "/resources/aries.jpg";
		} else if (i==2) {
			imageFilePath = "/resources/taurus.jpg";
		} else if (i==3) {
			imageFilePath = "/resources/gemini.jpg";
		} else if (i==4) {
			imageFilePath = "/resources/cancer.jpg";
		} else if (i==5) {
			imageFilePath = "/resources/leo.jpg";
		} else if (i==6) {
			imageFilePath = "/resources/virgo.jpg";
		} else if (i==7) {
			imageFilePath = "/resources/libra.jpg";
		} else if (i==8) {
			imageFilePath = "/resources/scorpio.jpg";
		} else if (i==9) {
			imageFilePath = "/resources/sagittarius.jpg";
		} else if (i==10) {
			imageFilePath = "/resources/capricorn.jpg";
		} else if (i==11) {
			imageFilePath = "/resources/aquarius.jpg";
		} else if (i==12) {
			imageFilePath = "/resources/pisces.jpg";
		}
		//Create HTML information and put it on the slide
		image = "<html><body style='padding-left: 110px;'><img width =900 height=600 src='" + getClass().getResource(imageFilePath) + "'</body></html>";
		return image;
	}
	
	//Method to get the text information added to values
	private String getTextDescription(int i) {
		//Definition of the variables to be used in conditional statements
		String text = "";
		String name = "";
		String description = "";
		String link = "";
		
		//Creation of each card giving its name, description and link which is dependent on which slide number the user is on
		if (i==1) {
			name = " Aries (Ram): March 21 - April 19";
			description = "In astrology, Aries is the first sign of the zodiac, considered as governing the period from about March 21 to about April 19. Its representation as a ram is identified with the Egyption god Amon and in Greek mythology is represented by a ram with the golden fleece which was obtained by the son of King Athamas who safely fled Thessaly to Colchis where he sacrificed the ram to Zeus who then placed it in the heaves as a constellation.";
			link = "https://www.britannica.com/place/Aries";
		} else if (i==2) {
			name = " Taurus (Bull): April 20 - May 20";
			description = "In astrology, Taurus is the second sign of the zodiac, considered as governing that portion of the year from about April 20 to about May 20. Its representaiton as a bull is related to the Greek myth of Zeus who assumed the form of a bull to abduct Europa.";
			link = "https://www.britannica.com/place/Taurus";
		} else if (i==3) {
			name = " Gemini (Twins): May 21 - June 21";
			description = "In astrology, Gemini is the third sign of the zodiac, considered as governing the period from about May 21 to about June 21. It is represented by a set of twins (or in Egyption astrology) by a pair of goats and in Arabian astrology by a pair of peacocks, the twins have also been related to other celebrated pairs, such as the younger and older Horus or Romulus and Remus.";
			link = "https://www.britannica.com/place/Gemini";
		} else if (i==4) {
			name = " Cancer (Crab): June 22 - July 22";
			description = "In astrology, Cancer is the fourth sign of the zodiac, considered as governing the period from about June 22 to about July 22. Its representation as a crab is related to teh crab in Greek mythology that pinched Heracles while he was fighting the Lernaean hydra. Crushed by Heracles, the crab was rewarded by Heracles' enemy, Hera, by being placed in the heavens.";
			link = "https://www.britannica.com/place/cancer";
		} else if (i==5) {
			name = " Leo (Lion): July 23 - August 22";
			description = "In astrology, Leo is the fifth sign of the zodiac, considered as governing the period from about July 23 to about August 22. Its representation as a lion is usually linked with the Nemean lion slain by Heracles as part of the 12 Labors he was forced to do as penance for killing his wife and children.";
			link = "https://www.britannica.com/place/leo";
		} else if (i==6) {
			name = " Virgo (Virgin): August 23 - September 22";
			description = "In astrology, Virgo is the sixth sign of the zodiac, considered as governing the period from about August 23 to about September 22. It is represented as a young maiden carrying a sheaf of wheat. She is variously identified as a fertility goddess or the harvest maiden.";
			link = "https://www.britannica.com/place/virgo";
		} else if (i==7) {
			name = " Libra (Balance): September 23 - October 23";
			description = "In astrology, Libra is the seventh sign of the zodiac, considered as governing the period from about September 22 to about OCtober 23. It is represented by a woman holding a balance scale or by the balance scale alone.";
			link = "https://www.britannica.com/place/libra";
		} else if (i==8) {
			name = " Scorpius (Scorpion): October 24 - November 21";
			description = "In astrology, Scorpius is the eighth sign of the zodiac considered as governing the period from about October 24 to about November 21. Its representation as a scorpion is related to teh Greek Iegend of the scorpion that stung Orion to death.";
			link = "https://britannica.com/place/scorpius";
		} else if (i==9) {
			name = " Sagittarius (Archer): November 22 - December 21";
			description = "In astrology, Sagittarius is the ninth sign of the zodiac, considered as governing the period from about November 22 to about December 21. It is represented either by a centaur shooting a bow and arrow or by an arrow drawn across a bow.";
			link = "https://www.britannica.com/place/sagittarius";
		} else if (i==10) {
			name = " Capricornus (Goat): December 22 - January 19";
			description = "In astronomy, Capricornus is the tenth sign of the zodiac, considered as governing the period from about December 22 to about January 19. It is represented by a goat";
			link = "https://www.britannica.com/place/capricorn";
		} else if (i==11) {
			name = " Aquarius (Water Bearer): January 20 - February 18";
			description = "In astrology, Aquarius is the 11th sign of the zodiac, considered as governing the period from about January 20 to about February 18. It is represented as a man pouring a stream of water out of a jug came about, it has been suggested because in ancient times the rising of Aquarius coincided in the Middle East with a period of floods and rain.";
			link = "https://www.britannica.com/place/aquarius";
		} else if (i==12) {
			name = " Pisces (Fish): February 19 - March 20";
			description = "In astrology, Pisces is the 12th sign of the zodiac, considered as governing the period from about February 19 to about March 20. Its representation as two fish tied together is usually related to the Greek myth of Aphrodite and Eros who jumped into a river to escape the monster Typhon and changed into fish.";
			link = "https://www.britannica.com/place/pisces";
		}
		
		//Setup for the HTML for the slide text
		text = "<html><head><style>@import url('https://fonts.googleapis.com/css2?family=Barlow&family=Lobster&display=swap');</style></head>"
				+ "<body style='text-align: center; padding-left: 10px; border: 6px solid #362419; color: #F9F1F0;font-family: 'Barlow', sans-serif;'>"
				+ "<font size='5'>"
				+ "#" + i + name
				+ "</font>"
				+ "<br>"
				+ description
				+ "<br>"
				+ "<font size='1'>"
				+ "Image from: " + link
				+ "</font>"
				+ "</body></html>";
		return text;
	}
	//Launch of the application
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			
			@Override
			public void run() {
				SlideShow ss = new SlideShow();
				ss.setVisible(true);
			}
		});
	}
}