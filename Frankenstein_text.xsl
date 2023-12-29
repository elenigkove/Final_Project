<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:tei="http://www.tei-c.org/ns/1.0"
    exclude-result-prefixes="xs tei" version="2.0">

    <!-- <xsl:output method="xml" omit-xml-declaration="yes" indent="yes" /> -->
    <xsl:template match="tei:teiHeader"/>


    <xsl:template match="tei:head">
        <div class="chapterTitle">
            <xsl:apply-templates/>
        </div>
    </xsl:template>
        
    <xsl:template match="tei:metamark[@function='pagenumber']">
        <span class="pageNumber">
            <xsl:apply-templates/>
        </span>
    </xsl:template>

    <!-- template for notes by Percy Shelly -->


    <xsl:template match="tei:body">
        <div class="row">
            <div class="col-3">
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <xsl:for-each select="//tei:add[@place = 'marginleft']">
                    <xsl:choose>
                        <xsl:when test="parent::tei:del">
                            <del>
                                <xsl:attribute name="class">
                                    <xsl:value-of select="attribute::hand"/>
                                </xsl:attribute>
                                <xsl:value-of select="."/>
                            </del>
                            <br/>
                        </xsl:when>
                        <xsl:otherwise>
                            <span>
                                <xsl:attribute name="class">
                                    <xsl:value-of select="attribute::hand"/>
                                </xsl:attribute>
                                <xsl:apply-templates/>
                               <br/>
                            </span>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:for-each>
            </div>
            <div class="col-9">
                <div class="transcription">
                    <xsl:apply-templates select="//tei:div"/>
                </div>
            </div>
        </div>
    </xsl:template>


    <xsl:template match="tei:p">
        <p>
            <xsl:apply-templates/>
        </p>
    </xsl:template>


    <xsl:template match="tei:add[@place = 'marginleft']">
        <span class="marginAdd">
            <xsl:apply-templates/>
        </span>
    </xsl:template>

    <xsl:template match="tei:del">
        <del>
            <xsl:attribute name="class">
                <xsl:value-of select="@hand"/>
            </xsl:attribute>
            <xsl:apply-templates/>
        </del>
    </xsl:template>





    <!-- all the supralinear additions are given in a span with the class supraAdd, make sure to put this class in superscript in the CSS file -->
    
    <xsl:template match="tei:add[@place='supralinear']">
        <span>
            <xsl:attribute name="class"> 
                <xsl:value-of select="concat('supraAdd', ' ', @hand)"/>
            </xsl:attribute>
            <xsl:apply-templates/>
        </span>
    </xsl:template>


    <!-- transforming the tei:lb in <br/> empty elements -->
    
    <xsl:template match="tei:lb">
        <br/>
    </xsl:template>
    

    <!-- transforming the tei:hi[@rend = 'sup'] in <sup> elements -->
    
    <xsl:template match="tei:hi[@rend='sup']">
        <sup>
            <xsl:apply-templates/>
        </sup>
    </xsl:template> 
    
    
    <!-- transforming additions with the attribute "overwritten" -->

    <xsl:template match="tei:add[@place='overwritten']">
        <span>
            <xsl:attribute name="class"> 
                <xsl:value-of select="concat('overwritten-text', ' ', @hand)"/>
            </xsl:attribute>
            <xsl:apply-templates/>
        </span>
    </xsl:template>
    

        <!-- transforming additions with the attribute "infralinear" -->
    
    <xsl:template match="tei:add[@place='infralinear']">
        <span>
            <xsl:attribute name="class"> 
                <xsl:value-of select="concat('infralinear-text', ' ', @hand)"/>
            </xsl:attribute>
            <xsl:apply-templates/>
        </span>
    </xsl:template>


    <xsl:template match="tei:lg">
            <div class="indentedPoem">
                <xsl:apply-templates/>
            </div>
        </xsl:template>
        
        <xsl:template match="tei:l">
            <p class="indentline">
                <xsl:apply-templates/>
            </p>
       </xsl:template>


    <!-- template for notes -->
    
    <xsl:template match="tei:note">
        <div class="note">
            <xsl:apply-templates/>
        </div>
    </xsl:template>
    
    
    <!-- template for metamarks -->
    
    <xsl:template match="tei:metamark">
        <span class="metamark">
            <xsl:apply-templates/>
        </span>
    </xsl:template>
    
    
    <!-- template for circled elements -->
    
    <xsl:template match="tei:hi[@rend='circled']">
        <span class="circled">
            <xsl:apply-templates/>
        </span>
    </xsl:template>

    
    <!-- Template for underlined elements -->

    <xsl:template match="tei:hi[@rend='u']">
        <span style="text-decoration: underline;">
            <xsl:apply-templates/>
        </span>
    </xsl:template>

  <xsl:template match="lb[@rend='indent']">
    <!-- Output a line break -->
    <br/>
    <!-- Use a span to apply indentation styling -->
    <span style="margin-left: 2em;">&#xA0;</span>
  </xsl:template>

  
    </xsl:stylesheet>


